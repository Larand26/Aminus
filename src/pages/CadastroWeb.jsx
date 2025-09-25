import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner"; // Adicione este import

import "../styles/cadastro-web.css";
import "../styles/tabela-produtos-web.css";
import "../styles/icons.css";

import { useState, useCallback, useEffect, use, useRef } from "react";

import imagemSemImagem from "../assets/img/unknown.jpg";

const palavrasParaRemover = [
  "FEMININO",
  "FEMININA",
  "MASCULINO",
  "MASCULINA",
  "INFANTIL",
  "BABY",
  "UNISEX",
  "CHINELO",
  "SANDALIA",
  "SLIDE",
  "RASTEIRA",
  "TAMANCO",
  "BABUCHE",
  "BABUCH",
  "BOTA",
  "SAPATILHA",
  "SAPATO",
  "PROMO",
  "TAM",
  "AD",
  "SAND",
  "CHIN",
  "FABRICA",
  "INF",
  "DEDO",
  "RAST",
];

const CadastroWeb = () => {
  const [referencia, setReferencia] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState({
    sku: "",
    numeros: [],
    quantidades: [],
    grupo: [],
  });
  const [nomeProduto, setNomeProduto] = useState("");
  const [nomeFormatado, setNomeFormatado] = useState("");
  const [novaCor, setNovaCor] = useState("");
  const [pai, setPai] = useState("");
  const [cadastroResponse, setCadastroResponse] = useState(null);
  const [imagem, setImagem] = useState(imagemSemImagem);
  const [loadingImagem, setLoadingImagem] = useState(false); // Novo estado
  const toast = useRef(null);

  useEffect(() => {
    const handler = (response) => {
      setCadastroResponse(response);
    };
    window.electronApi?.onCadastraProdutosWebResponse(handler);
    return () => {
      window.electronApi?.removeCadastraProdutosWebResponse?.(handler);
    };
  }, []);

  useEffect(() => {
    if (cadastroResponse) {
      if (cadastroResponse.success) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Produtos cadastrados com sucesso!",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao cadastrar produtos.",
          life: 3000,
        });
      }
      setCadastroResponse(null);
    }
  }, [cadastroResponse]);

  //Imagem
  useEffect(() => {
    const handler = (fotos) => {
      setLoadingImagem(true); // Começa carregando
      const fotosArray = Array.isArray(fotos) ? fotos : [fotos];
      const img = fotosArray[0]?.fotos
        ? `data:image/jpeg;base64,${fotosArray[0]?.fotos?.foto_principal}`
        : imagemSemImagem;
      setImagem(img);
      setLoadingImagem(false);
    };
    window.electronApi?.onSearchFotoResponse(handler);
    return () => {
      window.electronApi?.removeSearchFotoResponse(handler);
    };
  }, []);

  useEffect(() => {
    if (!produtoSelecionado.referencia || !produtoSelecionado.codigoCor) {
      setImagem([]);
      return;
    }
    setImagem(null);
    setLoadingImagem(true);
    const produto = {
      referencia: produtoSelecionado.referencia,
      codigo_cor: produtoSelecionado.codigoCor,
    };
    window.electronApi?.searchFoto(produto);
  }, [produtoSelecionado.referencia, produtoSelecionado.codigoCor]);

  //Função de cadastro
  const cadastro = () => {
    const produtosSelecionados = produtos
      .map((produto, idx) => ({ produto, idx }))
      .filter(({ idx }) => selectedProducts[idx]);

    const produtosParaCadastro = produtosSelecionados.map(
      ({ produto, idx }) => ({
        ID_CODPRODUTO: produto.ID_CODPRODUTO,
        PROD_REFERENCIA: referencia,
        PROD_NOME: nomeFormatado,
        PROD_PAI: pai,
        PROD_IDCOR: selectedCor[idx]?.value || 1,
        PROD_ATIVO: activeEcommerce[idx] === true ? 1 : 0,
      })
    );

    window.electronApi?.cadastraProdutosWeb(produtosParaCadastro);
  };

  const changeGrupo = (newGrupo, index) => {
    // troca o grupo atual pelo novo
    setProdutoSelecionado((prevProduto) => {
      const updatedGrupo = [...prevProduto.grupo];
      updatedGrupo[index] = newGrupo;
      return { ...prevProduto, grupo: updatedGrupo };
    });
  };

  const changePromo = (isPromo, index) => {
    setProdutoSelecionado((prevProduto) => {
      const updatedGrupo = [...prevProduto.grupo];
      if (isPromo) {
        updatedGrupo[index] = "PROMO";
      } else {
        updatedGrupo[index] = "GREN";
      }
      return { ...prevProduto, grupo: updatedGrupo };
    });
  };

  //Cria cor

  useEffect(() => {
    window.electronApi?.onCreateCorResponse((response) => {
      if (response.success) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Cor criada com sucesso!",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: response.message || "Erro ao criar cor.",
          life: 3000,
        });
      }
    });
  }, []);

  const createCor = () => {
    if (!novaCor) return;
    window.electronApi?.createCor(novaCor);
    setNovaCor("");
  };

  //Pai
  useEffect(() => {
    if (!produtoSelecionado.referencia) {
      setPai("-");
      return;
    }
    if (produtoSelecionado.grupo.includes("PROMO")) {
      let pai = `${produtoSelecionado.referencia}-PROMO-PAI`;
      setPai(pai);
    } else {
      let pai = `${produtoSelecionado.referencia}-GREN-PAI`;
      setPai(pai);
    }
  }, [produtoSelecionado]);

  //Name formatado
  useEffect(() => {
    let tipo = produtoSelecionado.grupo[3] || "";
    let genero = produtoSelecionado.grupo[2] || "";
    if (
      (tipo === "SANDÁLIA" ||
        tipo === "RASTEIRINHAS" ||
        tipo === "SAPATILHA" ||
        tipo === "BOTA") &&
      (genero === "MASCULINO" || genero === "FEMININO")
    ) {
      genero = genero === "MASCULINO" ? "MASCULINA" : "FEMININA";
    }

    switch (tipo) {
      case "SANDÁLIA":
        tipo = "SANDALIA";
        break;
      case "CHINELO DEDO":
        tipo = "CHINELO";
        break;
      case "CHINELO G├üSPEA/SLIDE":
        tipo = "CHINELO SLIDE";
        break;
      case "BABUCH":
        tipo = "BABUCHE";
        break;
      case "RASTEIRINHAS":
        tipo = "RASTEIRA";
        break;
      case "TAMANCO":
        tipo = "TAMANCO";
        break;
      case "BOTA":
        tipo = "BOTA";
        break;
      case "SAPATILHA":
        tipo = "SAPATILHA";
        break;
      case "SAPATO":
        tipo = "SAPATO";
        break;
      default:
        tipo = "";
    }
    const nomeFormatado = `${tipo} ${genero} ${nomeProduto} - ${produtoSelecionado.referencia}`;
    setNomeFormatado(nomeFormatado.trim());
  }, [nomeProduto, produtoSelecionado]);

  //produto selecionado

  const handleProdutoChange = (produto) => {
    if (!produto) return;
    const produtoSelecionado = {
      sku: produto?.ID_CODPRODUTO || "",
      referencia: produto?.PROD_CODFABRIC || "",
      numeros: produto?.NUMEROS.split(",") || [],
      quantidades: produto?.QUANTIDADES.split(",") || [],
      grupo: produto?.GRUP_DESCRICAO.split(", ") || [],
      codigoCor: produto?.CODIGO_COR || null,
    };
    setProdutoSelecionado(produtoSelecionado || {});
  };

  // Copia cor
  const copiaCor = (descricao) => {
    // pega tudo depois do } até antes do (
    const regex = /\}\s*([^\(]+)\s*\(/;
    const match = descricao.match(regex);
    if (match && match[1]) {
      const cor = match[1].trim().toUpperCase();
      setNovaCor(cor);
      // Copia para área de transferência
      navigator.clipboard.writeText(cor);
    }
  };

  //cores
  const [cores, setCores] = useState([]);
  const [selectedCor, setSelectedCor] = useState([]);

  const searchCores = (cor) => {
    window.electronApi?.getCores(cor || "");
    window.electronApi?.onGetCoresResponse((novasCores) => {
      // Junta as cores atuais com as novas e remove duplicadas pelo campo 'value'
      const todasCores = [...selectedCor, ...novasCores];
      const coresUnicas = todasCores.filter(
        (cor, index, self) =>
          index === self.findIndex((c) => c.value === cor.value)
      );
      setCores(coresUnicas);
    });
  };

  const handleCorChange = (index, value) => {
    const corSelecionada = cores.find((cor) => cor.value === value);
    // troca a cor selecionada no índice específico
    setSelectedCor((prev) => {
      const updated = [...prev];
      updated[index] = corSelecionada || null;
      return updated;
    });
  };

  useEffect(() => {
    if (selectedCor.length > 0) {
      searchCores();
    }
  }, [selectedCor]);

  useEffect(() => {
    console.log(produtos);
    setSelectedCor(
      produtos.map((produto) => ({
        value: produto.ID_CORES_ECOMERCE || null,
        label: produto.COR_DESCRICAO || "Nenhuma",
      }))
    );
    let nomeLimpo = produtos[0]?.ECOMMERCE_DESCRICAO || "";
    palavrasParaRemover.forEach((palavra) => {
      const regex = new RegExp(`\\b${palavra}\\b`, "gi");
      nomeLimpo = nomeLimpo.replace(regex, "");
    });
    nomeLimpo = nomeLimpo.replace(/-.*$/, "");
    nomeLimpo = nomeLimpo.replace(/\s{2,}/g, " ").trim();
    setNomeProduto(nomeLimpo);
    const produtoSelecionado = {
      sku: produtos[0]?.ID_CODPRODUTO || "",
      referencia: produtos[0]?.PROD_CODFABRIC || "",
      numeros: produtos[0]?.NUMEROS.split(",") || [],
      quantidades: produtos[0]?.QUANTIDADES.split(",") || [],
      grupo: produtos[0]?.GRUP_DESCRICAO.split(", ") || [],
      codigoCor: produtos[0]?.CODIGO_COR || null,
    };
    setProdutoSelecionado(produtoSelecionado || {});
  }, [produtos]);

  //Checkboxes
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [activeEcommerce, setActiveEcommerce] = useState([]);

  // Atualiza o estado dos checkboxes quando os produtos mudam
  useEffect(() => {
    setSelectedProducts(Array(produtos.length).fill(false));
  }, [produtos]);

  useEffect(() => {
    setActiveEcommerce(
      produtos.map(
        (produto) =>
          produto.PRO_ATIVO_ECOMMERCE === true &&
          produto.PRO_INTEGRACAO_ECOMMERCE === true
      )
    );
  }, [produtos]);

  const handleCheckboxChange = (index) => {
    setSelectedProducts((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleActiveEcommerceChange = (index) => {
    setActiveEcommerce((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleAllCheckBoxes = () => {
    const allChecked = selectedProducts.every((val) => val === true);
    setSelectedProducts(Array(produtos.length).fill(!allChecked));
  };

  const handleAllActiveEcommerce = () => {
    const allChecked = activeEcommerce.every((val) => val === true);
    setActiveEcommerce(Array(produtos.length).fill(!allChecked));
  };

  // Pesquisa os produtos
  const search = () => {
    if (!referencia || referencia.length < 4) return;
    window.electronApi?.searchCadastroProdutos(referencia);
    // searchCores();
  };

  useEffect(() => {
    window.electronApi?.onSearchCadastroProdutosResponse((produto) => {
      setProdutos(produto);
      setReferencia("");
    });
  }, []);

  //constroi tabela de produtos
  const renderTableRows = () => {
    return produtos.map((produto, index) => (
      <tr
        key={produto.ID_CODPRODUTO}
        className={
          produto.ID_CODPRODUTO === produtoSelecionado.sku ? "selecionado" : ""
        }
      >
        <td>
          <Checkbox
            onChange={() => handleCheckboxChange(index)}
            checked={!!selectedProducts[index]}
          />
        </td>
        <td onClick={() => handleProdutoChange(produto, index)}>
          {produto.ID_CODPRODUTO}
        </td>
        <td
          onClick={() => {
            handleProdutoChange(produto, index);
            copiaCor(produto.PROD_DESCRCOMPLETA);
          }}
        >
          {produto.PROD_DESCRCOMPLETA}
        </td>
        <td onClick={() => handleProdutoChange(produto, index)}>
          {produto.SKU_PRODUTO_PAI}
        </td>
        <td>
          <Dropdown
            filter
            options={cores}
            value={selectedCor[index]?.value || null}
            onChange={(e) => handleCorChange(index, e.value)}
            onFilter={(e) => searchCores(e.filter)}
            className="dropdown-cor"
          />
        </td>
        <td>
          <Checkbox
            checked={!!activeEcommerce[index]}
            onChange={() => handleActiveEcommerceChange(index)}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex">
      <Toast ref={toast} />
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText
            id="inputReferencia"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
          />
          <label htmlFor="inputReferencia">Referencia</label>
        </FloatLabel>
      </BarraLateral>
      <Content titulo={"Cadastro Web"}>
        <div className="mb-3 p-2 flex gap-3">
          <div className="cont-buttons">
            <Button
              title="Feminino"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("FEMININO")}
              icon="icon-female"
              iconPos="right"
              onClick={() => changeGrupo("FEMININO", 2)}
            />
            <Button
              title="Masculino"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("MASCULINO")}
              icon="icon-male"
              iconPos="right"
              onClick={() => changeGrupo("MASCULINO", 2)}
            />
            <Button
              title="Infantil"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("INFANTIL")}
              icon="icon-child"
              iconPos="right"
              onClick={() => changeGrupo("INFANTIL", 2)}
            />
            <Button
              title="Baby"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("BABY")}
              icon="icon-baby"
              iconPos="right"
              onClick={() => changeGrupo("BABY", 2)}
            />
            <Button
              title="Unisex"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("UNISEX")}
              icon="icon-unisex"
              iconPos="right"
              onClick={() => changeGrupo("UNISEX", 2)}
            />
            <Button
              severity="danger"
              title="Promo"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("PROMO")}
              onClick={() =>
                changePromo(!produtoSelecionado.grupo?.includes("PROMO"), 4)
              }
              icon="icon-promo"
              iconPos="right"
            />
          </div>
          <div className="cont-buttons">
            <Button
              title="Chinelo"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("CHINELO DEDO")}
              icon="icon-chinelo"
              iconPos="right"
              onClick={() => changeGrupo("CHINELO DEDO", 3)}
            />
            <Button
              title="Sandália"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("SANDÁLIA")}
              icon="icon-sandalia"
              iconPos="right"
              onClick={() => changeGrupo("SANDÁLIA", 3)}
            />
            <Button
              title="Slide"
              rounded
              outlined={
                !produtoSelecionado.grupo?.includes("CHINELO GÁSPEA/SLIDE")
              }
              icon="icon-slide"
              iconPos="right"
              onClick={() => changeGrupo("CHINELO GÁSPEA/SLIDE", 3)}
            />
            <Button
              title="Rasteira"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("RASTEIRINHAS")}
              icon="icon-rasteira"
              iconPos="right"
              onClick={() => changeGrupo("RASTEIRINHAS", 3)}
            />
            <Button
              title="Tamanco"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("TAMANCO")}
              icon="icon-tamanco"
              iconPos="right"
              onClick={() => changeGrupo("TAMANCO", 3)}
            />
            <Button
              title="Babuche"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("BABUCH")}
              icon="icon-babuche"
              iconPos="right"
              onClick={() => changeGrupo("BABUCH", 3)}
            />
            <Button
              title="Bota"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("BOTA")}
              icon="icon-bota"
              iconPos="right"
              onClick={() => changeGrupo("BOTA", 3)}
            />
            <Button
              title="Sapatilha"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("SAPATILHA")}
              icon="icon-sapatilha"
              iconPos="right"
              onClick={() => changeGrupo("SAPATILHA", 3)}
            />
            <Button
              title="Sapato"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("SAPATO")}
              icon="icon-sapato"
              iconPos="right"
              onClick={() => changeGrupo("SAPATO", 3)}
            />
            <Button
              title="Bolsa"
              rounded
              outlined={!produtoSelecionado.grupo?.includes("BOLSA")}
              icon="icon-bolsa"
              iconPos="right"
              onClick={() => changeGrupo("BOLSA", 3)}
            />
          </div>
          <div className="cont-grade">
            <div className="w-full ">
              <InputText
                placeholder="Nome do produto"
                className="w-full"
                value={nomeProduto}
                onChange={(e) => setNomeProduto(e.target.value.toUpperCase())}
              />
            </div>
            <div className="w-full flex">
              <InputText
                placeholder="Coloque uma cor nova..."
                className="w-full"
                value={novaCor}
                onChange={(e) => setNovaCor(e.target.value.toUpperCase())}
              />
              <Button
                icon="pi pi-plus"
                className="circle-btn"
                onClick={createCor}
              />
            </div>
            <div className="cont-tabela-grade-web">
              <table className="tabela-grade-web">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Qtd</th>
                  </tr>
                </thead>
                <tbody>
                  {produtoSelecionado.numeros &&
                    produtoSelecionado.numeros.map((num, idx) => (
                      <tr key={idx}>
                        <td>{num}</td>
                        <td>{produtoSelecionado.quantidades[idx]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="cont-display">
            <div className="display-dados">
              <div>
                <h3>Nome</h3>
                <p>{nomeFormatado}</p>
              </div>
              <hr />
              <div>
                <h3>Pai</h3>
                <p>{pai}</p>
              </div>
              <div style={{ justifyContent: "flex-end" }}>
                <Button
                  label="Cadastrar"
                  rounded
                  className="w-full"
                  onClick={cadastro}
                />
              </div>
            </div>
            <div className="display-imagem">
              {loadingImagem ? <ProgressSpinner /> : null}
              <img
                src={imagem}
                style={{ display: loadingImagem ? "none" : "block" }}
                onLoad={() => setLoadingImagem(false)}
                onError={() => setLoadingImagem(false)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-y-scroll h-25rem">
          <table className="tabela-produtos-web">
            <thead>
              <tr>
                <th>
                  <Checkbox
                    checked={selectedProducts.every((val) => val)}
                    onChange={() => handleAllCheckBoxes()}
                  />
                </th>
                <th>SKU</th>
                <th>Descrição</th>
                <th>Pai</th>
                <th>Cor</th>
                <th>
                  <Checkbox
                    checked={activeEcommerce.every((val) => val)}
                    onChange={() => handleAllActiveEcommerce()}
                  />
                </th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>
      </Content>
    </div>
  );
};
export default CadastroWeb;
