import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";

import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useState, useCallback, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

import "../styles/icons.css";

const CadastroWeb = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [referencia, setReferencia] = useState("");
  const [selectedProdutos, setSelectedProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [cores, setCores] = useState([]);
  const [novaCor, setNovaCor] = useState("");
  const [idCor, setIdCor] = useState("");
  const [grade, setGrade] = useState([]);
  const [grupo, setGrupo] = useState([]);
  const [nomeFormatado, setNomeFormatado] = useState("");
  const [pai, setPai] = useState("");
  const [coresCarregadas, setCoresCarregadas] = useState(false); // Novo estado
  const [promo, setPromo] = useState(grupo.includes("PROMO")); // valor inicial depende do grupo
  const toast = useRef(null);

  useEffect(() => {
    setPromo(grupo.includes("PROMO")); // atualiza promo quando grupo muda
  }, [grupo]);

  const cadastro = () => {
    // Seleciona os produtos atuais com checkbox marcado, garantindo cor e status atualizado
    const produtosSelecionados = produtos
      .filter((prod) =>
        selectedProdutos.some((sel) => sel.ID_CODPRODUTO === prod.ID_CODPRODUTO)
      )
      .map((prod) => ({
        ID_CODPRODUTO: prod.ID_CODPRODUTO,
        PROD_REFERENCIA: referencia,
        PROD_NOME: makeNomeFormatado(),
        PROD_PAI: makePai(),
        PROD_IDCOR: prod.ID_CORES_ECOMMERCE,
        PROD_ATIVO: prod.PRO_ATIVO_ECOMMERCE && prod.PRO_INTEGRACAO_ECOMMERCE, // true ou false
      }));
    console.log(produtosSelecionados);
    window.electronApi?.cadastraProdutosWeb(produtosSelecionados);
    window.electronApi?.onCadastraProdutosWebResponse((response) => {
      if (response.success) {
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
    });
  };

  const makePai = () => {
    const sufixo = promo ? "PROMO" : "GREN";
    return produtos[0]?.PROD_CODFABRIC + "-" + sufixo + "-" + "PAI";
  };

  const makeNomeFormatado = () => {
    let genero = grupo[2] || "";
    let tipo = grupo[3] || "";

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
      case "CHINELO GÁSPEA/SLIDE":
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
    const nomeFormatado = `${tipo} ${genero} ${nome} - ${
      produtos[0]?.PROD_CODFABRIC || ""
    }`;
    return nomeFormatado.toUpperCase();
  };

  const changeGrupo = (newGrupo, index) => {
    // troca o grupo atual pelo novo
    setGrupo((prevGrupo) => {
      const updatedGrupo = [...prevGrupo];
      updatedGrupo[index] = newGrupo;
      return updatedGrupo;
    });
  };

  const makeGrade = (numeros, quantidades) => {
    if (!numeros || !quantidades) return;

    const nums = numeros.split(",");
    const quants = quantidades.split(",");

    if (nums.length !== quants.length) {
      console.error("Números e quantidades têm tamanhos diferentes");
      return;
    }

    const novaGrade = nums.map((num, index) => ({
      NUMERO: num.trim(),
      QUANTIDADE: quants[index] ? quants[index].trim() : "0",
    }));

    setGrade(novaGrade);
  };

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
  ];
  useEffect(() => {
    const handler = (produtos) => {
      setProdutos(produtos);
      let nomeLimpo = produtos[0]?.ECOMMERCE_DESCRICAO || "";
      palavrasParaRemover.forEach((palavra) => {
        const regex = new RegExp(`\\b${palavra}\\b`, "gi");
        nomeLimpo = nomeLimpo.replace(regex, "");
      });
      nomeLimpo = nomeLimpo.replace(/-.*$/, "");
      nomeLimpo = nomeLimpo.replace(/\s{2,}/g, " ").trim();
      setNome(nomeLimpo);
      makeGrade(produtos[0]?.NUMEROS, produtos[0]?.QUANTIDADES);
      setGrupo(produtos[0]?.GRUP_DESCRICAO.split(", ") || []);
      setCarregando(false);
      setIdCor(produtos[0]?.ID_CORES_ECOMMERCE || 0);
      console.log(produtos[0]);
      setCores([
        {
          label: produtos[0]?.COR_DESCRICAO || "",
          value: produtos[0]?.ID_CORES_ECOMMERCE || 0,
        },
      ]);
      buscarCores("");
    };

    window.electronApi?.onSearchCadastroProdutosResponse(handler);

    return () => {
      window.electronApi?.removeSearchCadastroProdutosResponse?.(handler);
    };
  }, []); // Executa apenas uma vez

  const createCor = () => {
    if (!novaCor) return;
    window.electronApi?.createCor(novaCor);
    setNovaCor("");
  };

  const buscarProdutos = () => {
    setCarregando(true);
    window.electronApi?.searchCadastroProdutos(referencia);
  };

  const buscarCores = useCallback(() => {
    if (!coresCarregadas) {
      window.electronApi?.getCores();
      window.electronApi?.onGetCoresResponse?.((coresResponse) => {
        setCores(coresResponse || []);
        setCoresCarregadas(true);
      });
    }
  }, [coresCarregadas]);

  // Handler para seleção múltipla normal
  const selecionarProdutos = (e) => {
    setSelectedProdutos(e.value);
  };
  const checked = useCallback((e) => {}, []);

  const alternarStatusProduto = useCallback((index) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((prod, i) =>
        i === index
          ? {
              ...prod,
              PRO_ATIVO_ECOMMERCE: !prod.PRO_ATIVO_ECOMMERCE,
              PRO_INTEGRACAO_ECOMMERCE: !prod.PRO_INTEGRACAO_ECOMMERCE,
            }
          : prod
      )
    );
  }, []);

  const renderizarCheckboxAtivo = (rowData, options) => {
    const index = produtos.findIndex(
      (prod) => prod.ID_CODPRODUTO === rowData.ID_CODPRODUTO
    );
    const isAtivo =
      rowData.PRO_ATIVO_ECOMMERCE === true &&
      rowData.PRO_INTEGRACAO_ECOMMERCE === true;

    return (
      <input
        type="checkbox"
        checked={isAtivo}
        onChange={() => alternarStatusProduto(index)}
        style={{ width: "20px", height: "20px", cursor: "pointer" }} // Tamanho aumentado
      />
    );
  };

  // Remova o onShow do Dropdown
  // Adicione handler para buscar cores ao filtrar
  const handleCorFilter = (e) => {
    const termo = e.filter || "";
    window.electronApi?.getCores(termo);
    window.electronApi?.onGetCoresResponse?.((coresResponse) => {
      setCores(coresResponse || []);
    });
  };

  // Handler para marcar/desmarcar todos como ativos/inativos
  const alternarTodosAtivos = (checked) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((prod) => ({
        ...prod,
        PRO_ATIVO_ECOMMERCE: checked,
        PRO_INTEGRACAO_ECOMMERCE: checked,
      }))
    );
  };

  // Cabeçalho customizado para coluna "Ativo"
  const headerCheckboxAtivo = () => {
    // Verifica se todos estão ativos
    const todosAtivos =
      produtos.length > 0 &&
      produtos.every(
        (prod) => prod.PRO_ATIVO_ECOMMERCE && prod.PRO_INTEGRACAO_ECOMMERCE
      );
    return (
      <input
        type="checkbox"
        checked={todosAtivos}
        onChange={(e) => alternarTodosAtivos(e.target.checked)}
        style={{ width: "20px", height: "20px", cursor: "pointer" }}
        title="Selecionar todos ativos"
      />
    );
  };

  const alterarCorProduto = (idProduto, novaCorId) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((prod) =>
        prod.ID_CODPRODUTO === idProduto
          ? { ...prod, ID_CORES_ECOMMERCE: novaCorId }
          : prod
      )
    );
  };

  // Adicione handler para limpar cores ao abrir dropdown
  const handleDropdownShow = () => {
    window.electronApi?.getCores(""); // Busca as primeiras 50 cores
    window.electronApi?.onGetCoresResponse?.((coresResponse) => {
      setCores(coresResponse || []);
    });
  };

  const changePromo = () => {
    setPromo((prev) => !prev); // Inverte o valor de promo
  };

  return (
    <div className="flex">
      <Toast ref={toast} />
      <BarraLateral search={buscarProdutos}>
        <FloatLabel>
          <InputText
            id="inputNome"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") buscarProdutos();
            }}
          />
          <label htmlFor="inputNome">Referência</label>
        </FloatLabel>
      </BarraLateral>
      <div className="content flex flex-column align-items-center w-full min-h-screen bg-gray-200 p-4">
        <div
          className="p-2 flex w-full justify-content-center"
          style={{ height: "40%" }}
        >
          <div className="flex ">
            {/* Gênero */}
            <div className="p-2 flex flex-column gap-2">
              <Button
                icon="icon-female"
                aria-label="Filter"
                label="Feminino"
                value={"FEMININO"}
                onClick={() => changeGrupo("FEMININO", 2)}
                {...(!grupo.includes("FEMININO") && { outlined: true })}
              />
              <Button
                icon="icon-male"
                aria-label="Filter"
                label="Masculino"
                value={"MASCULINO"}
                onClick={() => changeGrupo("MASCULINO", 2)}
                {...(!grupo.includes("MASCULINO") && { outlined: true })}
              />
              <Button
                icon="icon-baby"
                aria-label="Filter"
                label="Baby"
                value={"BABY"}
                onClick={() => changeGrupo("BABY", 2)}
                {...(!grupo.includes("BABY") && { outlined: true })}
              />
              <Button
                icon="icon-child"
                aria-label="Filter"
                label="Infantil"
                value={"INFANTIL"}
                onClick={() => changeGrupo("INFANTIL", 2)}
                {...(!grupo.includes("INFANTIL") && { outlined: true })}
              />
              <Button
                icon="icon-unisex"
                aria-label="Filter"
                label="Unisex"
                value={"UNISEX"}
                onClick={() => changeGrupo("UNISEX", 2)}
                {...(!grupo.includes("UNISEX") && { outlined: true })}
              />
              <Button
                aria-label="Filter"
                label="Promo"
                value={"PROMO"}
                severity="danger"
                onClick={changePromo} // Chama a função para inverter promo
                {...(!promo && { outlined: true })} // outlined quando promo for false
              />
            </div>
            {/* Tipo */}
            <div className="p-2 flex flex-column gap-2">
              <Button
                icon="icon-chinelo"
                aria-label="Filter"
                label="Chinelo"
                value={"CHINELO DEDO"}
                onClick={() => changeGrupo("CHINELO DEDO", 3)}
                {...(!grupo.includes("CHINELO DEDO") && { outlined: true })}
              />
              <Button
                icon="icon-sandalia"
                aria-label="Filter"
                value={"SANDÁLIA"}
                onClick={() => changeGrupo("SANDÁLIA", 3)}
                {...(!grupo.includes("SANDÁLIA") && { outlined: true })}
                label="Sandália"
              />
              <Button
                icon="icon-slide"
                aria-label="Filter"
                value={"CHINELO GÁSPEA/SLIDE"}
                onClick={() => changeGrupo("CHINELO GÁSPEA/SLIDE", 3)}
                {...(!grupo.includes("CHINELO GÁSPEA/SLIDE") && {
                  outlined: true,
                })}
                label="Slide"
              />
              <Button
                icon="icon-rasteira"
                aria-label="Filter"
                value={"RASTEIRINHAS"}
                onClick={() => changeGrupo("RASTEIRINHAS", 3)}
                {...(!grupo.includes("RASTEIRINHAS") && { outlined: true })}
                label="Rasteira"
              />
              <Button
                icon="icon-tamanco"
                aria-label="Filter"
                value={"TAMANCO"}
                onClick={() => changeGrupo("TAMANCO", 3)}
                {...(!grupo.includes("TAMANCO") && { outlined: true })}
                label="Tamanco"
              />
              <Button
                icon="icon-babuch"
                aria-label="Filter"
                value={"BABUCH"}
                onClick={() => changeGrupo("BABUCH", 3)}
                {...(!grupo.includes("BABUCH") && { outlined: true })}
                label="Babuche"
              />
              <Button
                icon="icon-bota"
                aria-label="Filter"
                value={"BOTA"}
                onClick={() => changeGrupo("BOTA", 3)}
                {...(!grupo.includes("BOTA") && { outlined: true })}
                label="Bota"
              />
              <Button
                icon="icon-sapatilha"
                aria-label="Filter"
                value={"SAPATILHA"}
                onClick={() => changeGrupo("SAPATILHA", 3)}
                {...(!grupo.includes("SAPATILHA") && { outlined: true })}
                label="Sapatilha"
              />
              <Button
                icon="icon-sapato"
                aria-label="Filter"
                value={"SAPATO"}
                onClick={() => changeGrupo("SAPATO", 3)}
                {...(!grupo.includes("SAPATO") && { outlined: true })}
                label="Sapato"
              />
            </div>
          </div>
          <div
            className="flex flex-column align-items-center p-2 gap-2"
            style={{ width: "550px" }} // largura reduzida
          >
            <InputText
              className="w-full"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Dropdown
              value={idCor}
              options={cores}
              onChange={(e) => setIdCor(e.value)}
              placeholder="Selecione uma cor"
              className="w-full"
              filter
              onFilter={handleCorFilter} // Busca cores só ao digitar no filtro
              onShow={handleDropdownShow} // Limpa cores ao abrir
            />
            <div className="flex w-full gap-2">
              <InputText
                className="w-full"
                value={novaCor}
                onChange={(e) => setNovaCor(e.target.value.toUpperCase())}
              />
              <Button
                icon="pi pi-plus"
                aria-label="Filter"
                onClick={() => createCor()}
              />
            </div>
            <DataTable className="w-full" scrollHeight="200px" value={grade}>
              <Column
                field="NUMERO"
                header="Número"
                style={{ width: "50px", padding: "2px" }}
              />
              <Column
                field="QUANTIDADE"
                header="Quantidade"
                style={{ width: "50px", padding: "2px" }}
              />
            </DataTable>
          </div>
          <div
            className="result-card flex align-items-center gap-3 p-3 border-round border-1 surface-border bg-white shadow-2"
            style={{ minWidth: 300, minHeight: 80, width: 400 }}
          >
            <div className="w-full h-full flex flex-column align-items-center justify-content-around">
              <div className="font-bold text-lg mb-2">
                Nome formatado: <br />
                <span className="text-primary">{makeNomeFormatado()}</span>
              </div>
              <div className="mb-1">
                Pai: <br />
                <span className="font-medium">{makePai()}</span>
              </div>
              <div>
                Cor: <br />
                <span className="font-medium">
                  {produtos[0]?.COR_DESCRICAO || ""}
                </span>
              </div>
              <div className="w-full flex justify-content-center">
                <Button label="Cadastrar" onClick={cadastro} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex w-full justify-content-center">
          {/* Container com scroll para a tabela */}
          <div style={{ maxHeight: "400px", overflow: "auto", width: "100%" }}>
            <table className="w-full bg-white border-round shadow-1">
              <thead>
                <tr>
                  <th style={{ width: "3rem" }}>
                    {/* Checkbox para selecionar todos */}
                    <input
                      type="checkbox"
                      checked={
                        selectedProdutos.length === produtos.length &&
                        produtos.length > 0
                      }
                      onChange={(e) =>
                        setSelectedProdutos(
                          e.target.checked ? [...produtos] : []
                        )
                      }
                    />
                  </th>
                  <th>SKU</th>
                  <th>Descrição</th>
                  <th>Pai</th>
                  <th>Cor</th>
                  <th style={{ textAlign: "center" }}>
                    {/* Checkbox para todos ativos */}
                    <input
                      type="checkbox"
                      checked={
                        produtos.length > 0 &&
                        produtos.every(
                          (prod) =>
                            prod.PRO_ATIVO_ECOMMERCE &&
                            prod.PRO_INTEGRACAO_ECOMMERCE
                        )
                      }
                      onChange={(e) => alternarTodosAtivos(e.target.checked)}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      title="Selecionar todos ativos"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((prod, idx) => (
                  <tr
                    key={prod.ID_CODPRODUTO}
                    style={{ borderBottom: "1px solid #a6d4e4ff" }}
                    className={idx % 2 === 0 ? "bg-gray-400" : ""}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProdutos.some(
                          (p) => p.ID_CODPRODUTO === prod.ID_CODPRODUTO
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProdutos((prev) => [...prev, prod]);
                          } else {
                            setSelectedProdutos((prev) =>
                              prev.filter(
                                (p) => p.ID_CODPRODUTO !== prod.ID_CODPRODUTO
                              )
                            );
                          }
                        }}
                      />
                    </td>
                    <td>{prod.ID_CODPRODUTO}</td>
                    <td>{prod.PROD_DESCRCOMPLETA}</td>
                    <td>{prod.SKU_PRODUTO_PAI}</td>
                    <td>
                      <Dropdown
                        value={prod.ID_CORES_ECOMMERCE}
                        options={cores}
                        onChange={(e) => {
                          alterarCorProduto(prod.ID_CODPRODUTO, e.value);
                        }}
                        placeholder={prod.COR_DESCRICAO || "Selecione"}
                        filter
                        style={{ width: "180px" }}
                        showClear
                        onShow={handleDropdownShow}
                        onFilter={handleCorFilter}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={
                          prod.PRO_ATIVO_ECOMMERCE &&
                          prod.PRO_INTEGRACAO_ECOMMERCE
                        }
                        onChange={() => alternarStatusProduto(idx)}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CadastroWeb;
