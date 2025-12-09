drop TABLE Estoque;
drop table Transacoes;
drop table ItensTransacao;




CREATE TABLE Estoque (
    codigoProduto INT IDENTITY(1,1) PRIMARY KEY,
    descricaoProduto VARCHAR(100) NOT NULL,
    estoque INT NOT NULL
);


CREATE TABLE Transacoes (
    id_transacao INT IDENTITY(1,1) PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    data_transacao DATETIME NOT NULL DEFAULT GETDATE(),
    quantidade INT NOT NULL,
    id_estoque INT NOT NULL,
    FOREIGN KEY (id_estoque) REFERENCES Estoque(codigoProduto)

);


INSERT INTO Estoque (codigoProduto, descricaoProduto, estoque) VALUES
(101,'Caneta Azul', 150),
(102,'Caderno Universitário', 75),
(103,'Borracha Branca', 200),
(104,'Lápis Preto HB', 320),
(105,'Marcador de Texto Amarelo', 90);

SET IDENTITY_INSERT Estoque ON;
set IDENTITY_INSERT Estoque OFF;

select * from Estoque;
select * from Transacoes;
