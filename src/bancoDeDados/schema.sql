drop table if exists clientes;

drop table if exists pedido_status;

drop table if exists pedidos;

drop table if exists pedidos_imagens;

create table clientes (
	id serial primary key,
  	nome varchar(255) not null,
  	cpf varchar(15) unique not null,
  	data_nasc timestamptz not null,
  	telefone varchar(15),
  	ativo smallint not null default 1
);

create table pedido_status (
	id serial primary key,
  	descricao varchar(255) not null
);

create table pedidos (
	id serial primary key,
  	produto varchar(255) not null,
  	valor decimal(10, 2),
  	data timestamptz not null,
	cliente_id int references clientes(id) not null,
	pedido_status_id int references pedido_status(id) not null,
  	ativo smallint not null default 1
);


create table pedidos_imagens (
	id serial primary key,
  	pedido_id int references pedidos(id) not null,
  	imagen varchar(255),
  	capa varchar(255)
);
