USE mvpeai_eai;


CREATE TABLE Cliente(CodCliente INT PRIMARY KEY AUTO_INCREMENT,
					 Nome VARCHAR(50) NOT NULL,
                     CEP CHAR(8) NOT NULL,
                     Logradouro VARCHAR(60) NOT NULL,
                     Numero VARCHAR(6) NOT NULL,
                     Bairro VARCHAR(40) NOT NULL,
                     Ponto_ref VARCHAR(40) NULL,
                     Email VARCHAR(50) NOT NULL,
                     Telefone VARCHAR(12) NOT NULL,
                     Senha VARCHAR(30)) AUTO_INCREMENT = 10000;

CREATE TABLE Empresa(CodEmpresa INT PRIMARY KEY AUTO_INCREMENT,
					 CNPJ VARCHAR(30) NOT NULL,
					 Nome_empresarial VARCHAR(70) NOT NULL,
					 Nome_fantasia VARCHAR(60) NOT NULL,
                     Porte VARCHAR(35) NOT NULL,
                     CEP VARCHAR(30) NOT NULL,
                     Logradouro VARCHAR(60) NOT NULL,
                     Numero VARCHAR(10) NOT NULL,
                     Complemento VARCHAR(30) NULL,
                     Bairro VARCHAR(40) NOT NULL,
                     Municipio VARCHAR(30) NOT NULL,
                     UF CHAR(2) NOT NULL,
                     Telefone VARCHAR(30) NOT NULL,
					 Email VARCHAR(50) NOT NULL,
					 Senha VARCHAR(256) NOT NULL) AUTO_INCREMENT = 50000;
                     
CREATE TABLE Funcionario(CodFuncionario INT PRIMARY KEY AUTO_INCREMENT,
						 Nome VARCHAR(60) NOT NULL,
						 RG VARCHAR(30) NOT NULL,
						 CPF VARCHAR(30) NOT NULL,
						 Telefone VARCHAR(30) NOT NULL,
						 Sexo CHAR(1) NOT NULL,
						 Email VARCHAR(50) NOT NULL,
						 CodEmpresa INT,
						 FOREIGN KEY (CodEmpresa) REFERENCES Empresa(CodEmpresa),
						 Senha VARCHAR(256) NOT NULL) AUTO_INCREMENT = 30000;
                     
                                 

CREATE TABLE Pix(IdPix INT PRIMARY KEY AUTO_INCREMENT,
				 Valor DECIMAL(10,2) NOT NULL,
                 Banco VARCHAR(25) NOT NULL);
                 
CREATE TABLE Cartao(IdCartao INT PRIMARY KEY AUTO_INCREMENT,
					Nome VARCHAR(50) NOT NULL,
                    Valor DECIMAL(10,2) NOT NULL,
                    Bandeira VARCHAR(25) NOT NULL,
                    Numero VARCHAR(16) NOT NULL);
                      
CREATE TABLE Pagamento(IdPagamento INT PRIMARY KEY AUTO_INCREMENT,
					   Dt DATE NOT NULL,
                       Hora TIME NOT NULL,
                       Valor DECIMAL(10,2) NOT NULL,
                       IdPix INT,
                       IdCartao INT,
                       FOREIGN KEY (IdPix) REFERENCES Pix(IdPix),
                       FOREIGN KEY (IdCartao) REFERENCES Cartao(IdCartao));
 
 /* tabela antiga */
CREATE TABLE Solicitacao(CodSolicitacao INT PRIMARY KEY AUTO_INCREMENT,
						 Dt DATE NOT NULL,
                         Hora TIME NOT NULL,
                         Situacao VARCHAR(15) NOT NULL,
                         Servico VARCHAR(15) NOT NULL,
                         Localizacao VARCHAR(70) NOT NULL,
                         TipoLocal VARCHAR(25) NOT NULL,
                         AreaLocal VARCHAR(20) NOT NULL,
                         Telefone VARCHAR(30) NOT NULL,
                         CodFuncionario INT,
                         CodEmpresa INT,
                         CodCliente INT,
                         IdPagamento INT,
                         FOREIGN KEY (CodFuncionario) REFERENCES Funcionario (CodFuncionario),
                         FOREIGN KEY (CodEmpresa) REFERENCES Empresa (CodEmpresa),
                         FOREIGN KEY (CodCliente) REFERENCES Cliente (CodCliente),
                         FOREIGN KEY (IdPagamento) REFERENCES Pagamento (IdPagamento));
                         
 /* tabela nova */                         
create table Agendamento (CodAgendamento int primary key auto_increment not null, 
						  LocalServico varchar(50) not null,
						  DataServico date not null,
						  HoraServico time not null,
						  MedidasLocal varchar(10) not null,
						  Valor decimal(10,2) not null,
						  InfoAdicionais varchar(120),
						  Nome varchar(50) not null,
						  CPF varchar(11) not null,
						  FormasPagamento varchar(30) not null,
						  CEP varchar(8) not null,
						  Lougradouro varchar(50) not null,
						  Numero varchar(6) not null,
						  Bairro varchar(30) not null,
						  PontoDeRef varchar(120),
						  CodFuncionario INT,
                          CodEmpresa INT,
                          CodCliente INT,
                          IdPagamento INT,
                          FOREIGN KEY (CodFuncionario) REFERENCES Funcionario (CodFuncionario),
                          FOREIGN KEY (CodEmpresa) REFERENCES Empresa (CodEmpresa),
                          FOREIGN KEY (CodCliente) REFERENCES Cliente (CodCliente),
                          FOREIGN KEY (IdPagamento) REFERENCES Pagamento (IdPagamento));

SELECT * FROM Empresa;				