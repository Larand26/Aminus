SELECT
	E.[ID_CODENTIDADE]             AS ID_CLIENTE,
	E.[ENTI_RAZAOSOCIAL]           AS NOME_CLIENTE,
	E.[ENTI_CNPJCPF]               AS CNPJ,
	E.[ENTI_CELULAR]               AS CELULAR,
	E.[ENTI_EMAIL]                 AS EMAIL,
	E.[ENTI_FONE]                  AS TELEFONE,
	E.[ENTI_VLRULTCOMPRA]          AS ULTIMA_COMPRA,
	E.[ENTI_DDD]                   AS DDD,
	E.[ENTI_DDD_CELULAR]           AS DDD_CELULAR,
	E.[ENTI_DDD_FAX]               AS DDD_FAX,
	E.[STATUS_CLIENTE]             AS STATUS_CLIENTE
FROM [ENTIDADES] E
WHERE 1 = 1
-- Os filtros serão adicionados aqui pelo Node.js