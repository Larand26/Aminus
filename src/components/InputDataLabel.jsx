import { useState, useEffect } from "react";

import "../styles/input-data-label.css";

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const semanas = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const InputDataLabel = (props) => {
  const [open, setOpen] = useState(false);
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(new Date().getFullYear());
  const [dataSelecionada, setDataSelecionada] = useState([null, null]);

  useEffect(() => {
    if (props.onChange) {
      props.onChange(dataSelecionada);
    }
  }, [dataSelecionada, props.onChange]);

  const toggleCalendario = () => {
    setOpen(!open);
  };

  const formatarData = (data) => {
    if (!data) return "";
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const mudaMes = (novoMes) => () => {
    if (novoMes < 0) {
      setMes(11);
      setAno(ano - 1);
    } else if (novoMes > 11) {
      setMes(0);
      setAno(ano + 1);
    } else {
      setMes(novoMes);
    }
  };

  const selecionarData = (dia) => {
    const novaData = new Date(ano, mes, dia);
    let [inicio, fim] = dataSelecionada;

    if (!inicio && !fim) {
      setDataSelecionada([novaData, null]);
      return;
    }
    if (
      inicio.getTime() === novaData.getTime() ||
      fim?.getTime() === novaData.getTime()
    ) {
      setDataSelecionada([novaData, null]);
    } else if (inicio > novaData) {
      setDataSelecionada([novaData, inicio]);
    } else if (inicio < novaData) {
      setDataSelecionada([inicio, novaData]);
    }
  };

  const limparSelecao = (e) => {
    e.preventDefault();
    setDataSelecionada([null, null]);
    toggleCalendario();
  };

  const gerarDiasDoCalendario = () => {
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
    const dias = [];

    for (let i = primeiroDiaDoMes; i > 0; i--) {
      dias.push(
        <div key={`prev-${i}`} className="dia dia-outro-mes">
          {ultimoDiaMesAnterior - i + 1}
        </div>
      );
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataAtual = new Date(ano, mes, dia);
      dataAtual.setHours(0, 0, 0, 0);

      const [inicio, fim] = dataSelecionada;
      let classes = "dia";

      if (inicio && !fim) {
        const inicioNorm = new Date(inicio);
        inicioNorm.setHours(0, 0, 0, 0);
        if (dataAtual.getTime() === inicioNorm.getTime()) {
          classes += " data-selecionada";
        }
      } else if (inicio && fim) {
        const inicioNorm = new Date(inicio);
        inicioNorm.setHours(0, 0, 0, 0);
        const fimNorm = new Date(fim);
        fimNorm.setHours(0, 0, 0, 0);

        if (dataAtual.getTime() === inicioNorm.getTime()) {
          classes += " data-inicio";
        }
        if (dataAtual.getTime() === fimNorm.getTime()) {
          classes += " data-fim";
        }
        if (dataAtual > inicioNorm && dataAtual < fimNorm) {
          classes += " data-intervalo";
        }
      }

      dias.push(
        <div
          key={dia}
          className={classes}
          onClick={() => selecionarData(dia)}
          onContextMenu={limparSelecao}
        >
          {dia}
        </div>
      );
    }

    const celulasRestantes = 42 - dias.length; // 42 = 6 semanas * 7 dias
    for (let i = 1; i <= celulasRestantes; i++) {
      dias.push(
        <div key={`next-${i}`} className="dia dia-outro-mes">
          {i}
        </div>
      );
    }

    return dias;
  };

  return (
    <div className="input-data-label">
      <label>{props.label}</label>
      <div className="input-data" onClick={toggleCalendario}>
        <p id="result">
          {formatarData(dataSelecionada[0])}
          {dataSelecionada[1] ? ` - ${formatarData(dataSelecionada[1])}` : ""}
        </p>
        <i className="fa fa-calendar-days"></i>
      </div>
      <div className={`calendario ${open ? "open-calendario" : ""}`}>
        <div className="calendario-mes">
          <button onClick={mudaMes(mes - 1)}>
            <i className="fa fa-chevron-left"></i>
          </button>
          <div className="mes-ano">
            <span>{meses[mes]}</span>
            <br />
            <span>{ano}</span>
          </div>
          <button onClick={mudaMes(mes + 1)}>
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>
        <div className="dias">
          <div className="semana tabela-semana">
            {semanas.map((semana) => (
              <div key={semana} className="">
                {semana}
              </div>
            ))}
          </div>
          <div className="tabela-semana">{gerarDiasDoCalendario()}</div>
        </div>
      </div>
    </div>
  );
};

export default InputDataLabel;
