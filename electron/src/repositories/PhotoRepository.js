import MySQLDB from "../database/MySQLDB.js";

/**
 * @typedef {(sql: string, params?: Array<unknown>) => Promise<any>} QueryFn
 *
 * @typedef {Object} ProductPhoto
 * @property {number} id_photo
 * @property {string} url
 * @property {number} position
 *
 * @typedef {Object} CatalogProduct
 * @property {number} id_product
 * @property {string} manufacturer_code
 * @property {string} packing
 * @property {number} resale_price
 * @property {string} description
 * @property {number} id_color
 * @property {string} color_name
 * @property {string} color_code
 * @property {Array<ProductPhoto>} photos
 */

const defaultQuery = (sql, params) => MySQLDB.catalogQuery(sql, params);

const PRODUCT_SELECT = `
  SELECT
    p.id_product,
    p.manufactur_code AS manufacturer_code,
    p.packing,
    m.resale_price,
    m.description,
    c.id_color,
    c.name_color AS color_name,
    c.manufacturer_color_code AS color_code,
    ph.id_photo,
    ph.photo_url,
    ph.position
  FROM products p
  INNER JOIN manufacturers m ON m.manufactur_code = p.manufactur_code
  INNER JOIN colors c ON c.id_color = p.id_color
  LEFT JOIN photos ph ON ph.id_product = p.id_product`;

/**
 * Agrupa as linhas do JOIN (uma por foto) em produtos com o array `photos`.
 * @returns {Array<CatalogProduct>}
 */
const groupProductRows = (rows) => {
  const products = new Map();
  for (const row of rows) {
    let product = products.get(row.id_product);
    if (!product) {
      product = {
        id_product: row.id_product,
        manufacturer_code: row.manufacturer_code,
        packing: row.packing,
        resale_price: Number(row.resale_price),
        description: row.description,
        id_color: row.id_color,
        color_name: row.color_name,
        color_code: row.color_code,
        photos: [],
      };
      products.set(row.id_product, product);
    }
    if (row.id_photo != null) {
      product.photos.push({
        id_photo: row.id_photo,
        url: row.photo_url,
        position: row.position,
      });
    }
  }
  return [...products.values()];
};

class PhotoRepository {
  /**
   * @param {{manufacturer?: string, color?: string, ids?: Array<number>}} filters
   * @returns {Promise<Array<CatalogProduct>>}
   */
  static async findProducts(filters = {}, query = defaultQuery) {
    const conditions = [];
    const params = [];

    if (filters.manufacturer) {
      conditions.push("p.manufactur_code = ?");
      params.push(filters.manufacturer);
    }
    if (filters.color) {
      conditions.push("c.manufacturer_color_code = ?");
      params.push(filters.color);
    }
    if (Array.isArray(filters.ids)) {
      if (filters.ids.length === 0) return [];
      conditions.push("p.id_product IN (?)");
      params.push(filters.ids);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = await query(
      `${PRODUCT_SELECT} ${where} ORDER BY p.manufactur_code, c.manufacturer_color_code, p.id_product, ph.position`,
      params,
    );
    return groupProductRows(rows);
  }

  /** @returns {Promise<CatalogProduct | null>} */
  static async findProductById(idProduct, query = defaultQuery) {
    const [product] = await PhotoRepository.findProducts(
      { ids: [idProduct] },
      query,
    );
    return product || null;
  }

  /**
   * Produto com a mesma referência e mesmo nome de cor (regra de negócio) ou mesmo código de cor
   * (as fotos de ambos cairiam na mesma chave do bucket). `excludeId` ignora o próprio produto na edição.
   * Prioriza o conflito de código, que exige usar "Editar" em vez de renomear.
   * @returns {Promise<CatalogProduct | null>}
   */
  static async findProductByVariant(
    { manufacturerCode, colorCode, colorName, excludeId = null },
    query = defaultQuery,
  ) {
    const [row] = await query(
      `SELECT p.id_product
         FROM products p
         INNER JOIN colors c ON c.id_color = p.id_color
        WHERE p.manufactur_code = ?
          AND (c.manufacturer_color_code = ? OR UPPER(TRIM(c.name_color)) = ?)
          AND (? IS NULL OR p.id_product <> ?)
        ORDER BY c.manufacturer_color_code = ? DESC
        LIMIT 1`,
      [manufacturerCode, colorCode, colorName, excludeId, excludeId, colorCode],
    );
    return row ? PhotoRepository.findProductById(row.id_product, query) : null;
  }

  static async findManufacturer(manufacturerCode, query = defaultQuery) {
    const [row] = await query(
      `SELECT manufactur_code AS manufacturer_code, resale_price, description
         FROM manufacturers WHERE manufactur_code = ?`,
      [manufacturerCode],
    );
    return row || null;
  }

  /** Embalagem já usada pela referência: novas cores herdam a mesma. */
  static async findPackingByManufacturer(manufacturerCode, query = defaultQuery) {
    const [row] = await query(
      "SELECT packing FROM products WHERE manufactur_code = ? LIMIT 1",
      [manufacturerCode],
    );
    return row?.packing || null;
  }

  static async upsertManufacturer(
    { manufacturerCode, resalePrice, description },
    query = defaultQuery,
  ) {
    await query(
      `INSERT INTO manufacturers (manufactur_code, resale_price, description)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE resale_price = VALUES(resale_price), description = VALUES(description)`,
      [manufacturerCode, resalePrice, description],
    );
  }

  static async insertManufacturerIfMissing(
    { manufacturerCode, resalePrice, description },
    query = defaultQuery,
  ) {
    await query(
      `INSERT IGNORE INTO manufacturers (manufactur_code, resale_price, description)
       VALUES (?, ?, ?)`,
      [manufacturerCode, resalePrice, description],
    );
  }

  /** @returns {Promise<number>} id_color */
  static async findOrCreateColor({ colorCode, colorName }, query = defaultQuery) {
    const [existing] = await query(
      `SELECT id_color FROM colors
        WHERE manufacturer_color_code = ? AND name_color = ? LIMIT 1`,
      [colorCode, colorName],
    );
    if (existing) return existing.id_color;

    const result = await query(
      "INSERT INTO colors (name_color, manufacturer_color_code) VALUES (?, ?)",
      [colorName, colorCode],
    );
    return result.insertId;
  }

  /** @returns {Promise<number>} id_product */
  static async insertProduct(
    { manufacturerCode, packing, idColor },
    query = defaultQuery,
  ) {
    const result = await query(
      "INSERT INTO products (manufactur_code, packing, id_color) VALUES (?, ?, ?)",
      [manufacturerCode, packing, idColor],
    );
    return result.insertId;
  }

  static async updateProduct(
    idProduct,
    { manufacturerCode, packing, idColor },
    query = defaultQuery,
  ) {
    await query(
      `UPDATE products SET manufactur_code = ?, packing = ?, id_color = ?
        WHERE id_product = ?`,
      [manufacturerCode, packing, idColor, idProduct],
    );
  }

  /**
   * Substitui todas as fotos do produto pela lista informada (posição = ordem do array, a partir de 1).
   * @param {number} idProduct
   * @param {Array<string>} photoUrls
   */
  static async replacePhotos(idProduct, photoUrls, query = defaultQuery) {
    await query("DELETE FROM photos WHERE id_product = ?", [idProduct]);
    if (photoUrls.length === 0) return;

    const values = photoUrls.map((url, index) => [idProduct, url, index + 1]);
    await query(
      "INSERT INTO photos (id_product, photo_url, position) VALUES ?",
      [values],
    );
  }

  /** As fotos saem junto pelo ON DELETE CASCADE. */
  static async deleteProduct(idProduct, query = defaultQuery) {
    const result = await query("DELETE FROM products WHERE id_product = ?", [
      idProduct,
    ]);
    return result.affectedRows > 0;
  }
}

export default PhotoRepository;
