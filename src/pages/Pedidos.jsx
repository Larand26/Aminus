import BarraLateral from "../components/BarraLateral";
import Content from "../components/Content";
import PopUp from "../components/PopUp";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState, useCallback, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import vendedoresJson from "../assets/json/vendedores.json";
import { Button } from "primereact/button";
import createPDF from "../utils/createPDF";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputSwitch } from "primereact/inputswitch";
import { Dialog } from "primereact/dialog"; // 1. Importar Dialog

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [data, setData] = useState(null);
  const [vendedor, setVendedor] = useState(() => {
    let idFuncaoUsuario = null;
    try {
      idFuncaoUsuario = parseInt(localStorage.getItem("userFuncao"));
    } catch {}
    if (idFuncaoUsuario === 2) {
      const nome = localStorage.getItem("user");
      return vendedoresJson.find((v) => v.label === nome)?.value || null;
    }
    return null;
  });
  const [situacao, setSituacao] = useState(null);
  const [itensPedido, setItensPedido] = useState([]);
  const [cubagemItens, setCubagemItens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itemSelecionadoParaCotacao, setItemSelecionadoParaCotacao] =
    useState(null);
  // 2. Novos estados para o modal de cotação
  const [isCotacaoVisible, setIsCotacaoVisible] = useState(false);
  const [cotacaoData, setCotacaoData] = useState(null);

  // Recupera função do usuário do localStorage
  let idFuncaoUsuario = null;
  try {
    idFuncaoUsuario = parseInt(localStorage.getItem("userFuncao"));
  } catch {}

  const search = () => {
    setLoading(true);
    let idFuncaoUsuario = null;
    try {
      idFuncaoUsuario = parseInt(localStorage.getItem("userFuncao"));
    } catch {}
    let vendedorFinal = vendedor;
    if (idFuncaoUsuario === 2) {
      const nome = localStorage.getItem("user");
      vendedorFinal =
        vendedoresJson.find((v) => v.label === nome)?.value || null;
      setVendedor(vendedorFinal);
    }
    const pedido = {
      numero: document.getElementById("inputNumero").value || null,
      cnpj:
        document.getElementById("inputCnpj").value.replace(/\D/g, "") || null,
      dataInicial: data ? (data[0] ? data[0].toISOString() : null) : null,
      dataFinal: data ? (data[1] ? data[1].toISOString() : null) : null,
      situacao: situacao || null,
      vendedor: vendedorFinal,
    };
    if (
      !pedido.numero &&
      !pedido.cnpj &&
      !pedido.dataInicial &&
      !pedido.dataFinal &&
      !pedido.situacao &&
      !pedido.vendedor
    ) {
      console.warn("Nenhum filtro aplicado.");
      setLoading(false);
      return;
    }

    window.electronApi?.searchPedido(pedido);
    window.electronApi?.onSearchPedidoResponse((pedidos) => {
      setPedidos(pedidos);
      console.log("Pedidos recebidos:", pedidos);

      setLoading(false);
      // Limpa os inputs após a pesquisa
      document.getElementById("inputNumero").value = "";
      document.getElementById("inputCnpj").value = "";
      setData(null);
      document.getElementById("inputSituacao").value = "";
    });
  };
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      search();
    }
  }, []);

  useEffect(() => {
    const inputs = [
      document.getElementById("inputNumero"),
      document.getElementById("inputCnpj"),
      document.getElementById("inputDataInicial"),
      document.getElementById("inputDataFinal"),
      document.getElementById("inputSituacao"),
      document.getElementById("inputVendedor"),
    ];
    inputs.forEach((input) => {
      if (input) input.addEventListener("keydown", handleKeyDown);
    });
    return () => {
      inputs.forEach((input) => {
        if (input) input.removeEventListener("keydown", handleKeyDown);
      });
    };
  }, [handleKeyDown]);
  const closePopup = () => {
    document.getElementById("popup").style.transform = "scale(0)";
  };
  const openPopup = () => {
    document.getElementById("popup").style.transform = "scale(1)";
  };
  const getPedido = (numero) => {
    openPopup();
    window.electronApi?.getPedido(numero);
    window.electronApi?.onGetPedidoResponse((itensPedido) => {
      const items = itensPedido || [];
      setItensPedido(items);

      if (items.length > 0) {
        // Encontra o item com o maior PROD_PESOBRUTO
        const itemMaisPesado = items.reduce((maisPesado, itemAtual) => {
          const pesoMaisPesado = parseFloat(maisPesado.PROD_PESOBRUTO) || 0;
          const pesoItemAtual = parseFloat(itemAtual.PROD_PESOBRUTO) || 0;
          return pesoItemAtual > pesoMaisPesado ? itemAtual : maisPesado;
        }, items[0]);

        // Define o item mais pesado como selecionado por padrão
        setItemSelecionadoParaCotacao(itemMaisPesado);
      } else {
        // Limpa a seleção se não houver itens
        setItemSelecionadoParaCotacao(null);
      }

      console.log("Itens do pedido recebidos:", items);
    });
  };
  useEffect(() => {
    if (!window.electronApi) return;

    const handleCubagem = (cubagemItens) => {
      // Agrupa por PROD_CODFABRIC e soma a quantidade
      const agrupado = {};
      cubagemItens.forEach((item) => {
        const cod = item.PROD_CODFABRIC;
        if (!agrupado[cod]) {
          agrupado[cod] = {
            ID_NUMPEDORC: item.ID_NUMPEDORC,
            PROD_CODFABRIC: item.PROD_CODFABRIC,
            PROD_ALTURA: item.PROD_ALTURA,
            PROD_COMPRIMENTO: item.PROD_COMPRIMENTO,
            PROD_LARGURA: item.PROD_LARGURA,
            ITPEDOR_QUANTID: item.ITPEDOR_QUANTID,
          };
        } else {
          agrupado[cod].ITPEDOR_QUANTID += item.ITPEDOR_QUANTID;
        }
      });

      const cubagemComSoma = Object.values(agrupado);
      console.log("Dados de cubagem recebidos:", cubagemComSoma);

      let cubagem = 0;
      cubagemComSoma.forEach((item) => {
        const volume =
          (item.PROD_ALTURA * item.PROD_COMPRIMENTO * item.PROD_LARGURA) /
          1000000;
        cubagem += volume * (item.ITPEDOR_QUANTID / 12);
      });

      setCubagemItens(cubagemComSoma);
      createPDF(cubagemComSoma, cubagem);
    };

    // Remova antes de adicionar (se existir esse método)
    if (window.electronApi.removeMakeCubagemResponse) {
      window.electronApi.removeMakeCubagemResponse(handleCubagem);
    }
    window.electronApi.onMakeCubagemResponse(handleCubagem);

    return () => {
      if (window.electronApi.removeMakeCubagemResponse) {
        window.electronApi.removeMakeCubagemResponse(handleCubagem);
      }
    };
  }, []);

  // 4. Listener para a resposta da cotação
  useEffect(() => {
    if (!window.electronApi) return;

    const handleCotacaoResponse = (response) => {
      if (response.error) {
        console.error("Erro na cotação:", response.error, response.details);
        // Adicione um toast ou alerta para o usuário aqui
      } else {
        console.log("Cotação recebida:", response);
        setCotacaoData(response);
        setIsCotacaoVisible(true); // Abre o modal com os dados
      }
    };

    window.electronApi.onMakeCotacaoResponse(handleCotacaoResponse);

    return () => {
      if (window.electronApi.removeMakeCotacaoResponse) {
        window.electronApi.removeMakeCotacaoResponse(handleCotacaoResponse);
      }
    };
  }, []); // Executa apenas uma vez para registrar o listener

  const makeCubagem = async () => {
    window.electronApi?.makeCubagem(itensPedido);
  };

  const makeCotacao = () => {
    if (!pedidoSelecionado) {
      console.error("Nenhum pedido selecionado.");
      return;
    }

    if (!itemSelecionadoParaCotacao) {
      console.warn("Nenhum item selecionado para a cotação.");
      return;
    }

    const quantidadeTotal = itensPedido.reduce((total, item) => {
      return total + item.ITPEDOR_QUANTID;
    }, 0);

    // Apenas envia a requisição. A resposta será tratada pelo listener no useEffect.
    window.electronApi?.makeCotacao({
      quantidade: quantidadeTotal,
      cep: pedidoSelecionado.ENTI_CEP,
      peso: pedidoSelecionado.PEDOR_PESOBRUTO,
      item: itemSelecionadoParaCotacao,
      itensPedido: itensPedido,
      valor: pedidoSelecionado.PEDOR_VLRTOTAL,
    });
  };

  const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "R$ 0,00";
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="flex">
      <BarraLateral search={search}>
        <FloatLabel>
          <InputText id="inputNumero" />
          <label htmlFor="inputNumero">Número do Pedido</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="inputCnpj" />
          <label htmlFor="inputCnpj">CNPJ</label>
        </FloatLabel>
        <FloatLabel>
          <Calendar
            id="inputDataInicial"
            value={data}
            selectionMode="range"
            dateFormat="dd/mm"
            onChange={(e) => setData(e.value)}
          />
          <label htmlFor="inputDataInicial">Data</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            className="md:w-12rem "
            options={[
              { label: "Pendente", value: "Pendente" },
              { label: "Cancelado", value: "Cancelado" },
              { label: "Atendido", value: "Atendido" },
            ]}
            id="inputSituacao"
            value={situacao}
            onChange={(e) => setSituacao(e.value)}
          />
          <label htmlFor="inputSituacao">Situação</label>
        </FloatLabel>
        {idFuncaoUsuario !== 2 && (
          <FloatLabel>
            <Dropdown
              options={vendedoresJson}
              id="inputVendedor"
              className="md:w-12rem "
              value={vendedor}
              onChange={(e) => setVendedor(e.value)}
            />
            <label htmlFor="inputVendedor">Vendedor</label>
          </FloatLabel>
        )}
      </BarraLateral>
      <Content titulo={"Pedidos"}>
        {loading ? (
          <div
            className="flex justify-content-center align-items-center w-full"
            style={{ minHeight: 200 }}
          >
            <ProgressSpinner />
          </div>
        ) : (
          <DataTable
            paginator
            rows={10}
            emptyMessage="Nenhum produto encontrado"
            value={pedidos}
            showGridlines
            filters={filters}
            onFilter={(e) => setFilters(e.filters)}
            globalFilterFields={[
              "ID_NUMPEDORC",
              "ID_CODENTIDADE",
              "PEDOR_RAZAOSOCIAL",
              "PEDOR_SITUACAO",
            ]}
            header={
              <InputText
                type="search"
                onInput={(e) =>
                  setFilters({
                    ...filters,
                    global: {
                      value: e.target.value,
                      matchMode: FilterMatchMode.CONTAINS,
                    },
                  })
                }
                placeholder="Filtrar pedidos"
              />
            }
            id="tabelaPedidos"
            onRowClick={(e) => {
              // 2. Guarda o pedido selecionado e busca os itens
              setPedidoSelecionado(e.data);
              getPedido(e.data.ID_NUMPEDORC);
            }}
          >
            <Column field="ID_NUMPEDORC" header="Número" />
            <Column field="ID_CODENTIDADE" header="ID do cliente" />
            <Column field="PEDOR_RAZAOSOCIAL" header="Nome" />
            <Column field="PEDOR_PESOBRUTO" header="Peso Bruto" />
            <Column
              body={(rowData) => {
                if (!rowData.PEDOR_DATA) return "";
                if (rowData.PEDOR_DATA instanceof Date) {
                  return rowData.PEDOR_DATA.toLocaleDateString("pt-BR");
                }
                if (
                  typeof rowData.PEDOR_DATA === "string" ||
                  typeof rowData.PEDOR_DATA === "number"
                ) {
                  const d = new Date(rowData.PEDOR_DATA);
                  if (!isNaN(d)) return d.toLocaleDateString("pt-BR");
                  return rowData.PEDOR_DATA;
                }
                return rowData.PEDOR_DATA;
              }}
              header="Data"
            />
            <Column field="PEDOR_SITUACAO" header="Situação" />
            <Column
              body={(rowData) =>
                vendedoresJson.find((v) => v.value === rowData.ID_CODVENDEDOR)
                  ?.label || "Desconhecido"
              }
              header="Vendedor"
            />
          </DataTable>
        )}
      </Content>
      <PopUp onClose={closePopup}>
        {/* 2. Atualizar a DataTable */}
        <DataTable
          value={itensPedido}
          emptyMessage="Nenhum item encontrado"
          scrollHeight="500px"
          selectionMode="radiobutton"
          selection={itemSelecionadoParaCotacao}
          onSelectionChange={(e) => setItemSelecionadoParaCotacao(e.value)}
          dataKey="ID_CODPRODUTO"
        >
          {/* 3. Substituir a coluna do InputSwitch */}
          <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
          <Column field="ID_CODPRODUTO" header="Código" />
          <Column field="ITPEDOR_DESCRPROD" header="Descrição" />
          <Column field="ITPEDOR_QUANTID" header="Quantidade" />
          <Column
            body={(rowData) => {
              const peso = parseFloat(rowData.PROD_PESOBRUTO);
              return isNaN(peso) ? "0 kg" : `${(peso * 12).toFixed(2)} kg`;
            }}
            header="Peso"
          />
          <Column field="ITPEDOR_VLRUNIT" header="Valor unitário" />
          <Column field="ITPEDOR_VLRLIQU" header="Valor líquido" />
        </DataTable>
        <div className="flex justify-content-end mt-3 gap-2">
          <Button icon="fa fa-box" label="Cubagem" onClick={makeCubagem} />
          <Button icon="fa fa-truck" label="Cotação" onClick={makeCotacao} />
        </div>
      </PopUp>

      {/* 3. Modal para exibir os resultados da cotação */}
      <Dialog
        header="Resultado da Cotação"
        visible={isCotacaoVisible}
        style={{ width: "75vw" }}
        onHide={() => setIsCotacaoVisible(false)}
      >
        <div className="grid">
          <div className="col-12 md:col-6">
            <h3>Cotação Padrão</h3>
            <DataTable
              value={cotacaoData?.padrao?.ShippingSevicesArray}
              emptyMessage="Nenhum serviço encontrado."
              sortField="PresentationalPrice"
              sortOrder={1}
              scrollHeight="400px"
            >
              <Column field="Carrier" header="Transportadora" sortable />
              <Column
                field="PresentationalPrice"
                header="Preço"
                body={(rowData) => formatCurrency(rowData.PresentationalPrice)}
                sortable
              />
              <Column
                field="OriginalDeliveryTime"
                header="Prazo (dias)"
                body={(rowData) => `${rowData.OriginalDeliveryTime} dia(s)`}
                sortable
              />
            </DataTable>
          </div>
          <div className="col-12 md:col-6">
            <h3>
              Cotação Personalizada{" "}
              <i
                className="custom-cotacao-info fa fa-question-circle"
                title="Utilizado para Brasspress e Jamef"
              ></i>
            </h3>
            <DataTable
              value={cotacaoData?.personalizado?.ShippingSevicesArray}
              emptyMessage="Nenhum serviço encontrado."
              sortField="PresentationalPrice"
              sortOrder={1}
              scrollHeight="400px"
            >
              <Column field="Carrier" header="Transportadora" sortable />
              <Column
                field="PresentationalPrice"
                header="Preço"
                body={(rowData) => formatCurrency(rowData.PresentationalPrice)}
                sortable
              />
              <Column
                field="OriginalDeliveryTime"
                header="Prazo (dias)"
                body={(rowData) => `${rowData.OriginalDeliveryTime} dia(s)`}
                sortable
              />
            </DataTable>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Pedidos;
