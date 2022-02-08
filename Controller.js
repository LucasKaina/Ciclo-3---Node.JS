const express = require('express');
const cors = require('cors');
const {Sequelize} = require('./models');

const models=require('./models');
const {response}=require('express');

const app = express();
app.use(cors());
app.use(express.json());

let cliente=models.Cliente;
let itempedido= models.ItemPedido;
let pedido = models.Pedido;
let servico= models.Servico;
let compra=models.Compra;
let itemcompra=models.ItemCompra;
let produto=models.Produto;

app.get('/', function(req, res){
    res.send('Seja bem vindo(a) a Service TI')
})


// inserir serviços
app.post('/servicos', async(req, res)=>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar"
        });
    });
});


// todos os servicos
app.get('/listaservicos', async(req, res)=>{
    await servico.findAll({
        // raw: true
        order: [['nome', 'DESC']] //ordem decrescente//
        // order: [['nome', 'ASC']] //ordem ascendente//
    }).then(function(servicos){
        res.json({servicos})
    });
});



// contagem servicos
app.get('/ofertaservicos', async(req, res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
}); 


// descobrir servico pelo ID
app.get('/servico/:id', async(req, res)=>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: código não encontrado"
        });
            
    });
});


// atualizando servico
app.put('/atualizaservico', async(req, res)=>{
    await servico.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço arterado com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Houve erro na tentativa de alteração do serviço"
        });
    });
});

// Excluir servico
app.get('/excluirservico/:id', async(req, res)=>{
    await servico.destroy({
        where: {id: req.params.id}
    }).then (function(){
        return res.json({
            error: false,
            message: "Servico foi excluido com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível excluir o servico."
        });
    });
});



//inserindo clientes
app.post('/clientes', async(req, res)=>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Cliente inserido com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir o cliente"
        });
    });
});


// exibir todos os clientes
app.get('/listaclientes', async(req, res)=>{
    await cliente.findAll()
    .then(cli =>{
        return res.json({
            error: false,
            cli
        });
    }).catch((erro) => {
        return res.status(400).json({
            error: true,
            message:"Erro de conexão"
        });
    });
});


// exibir todos os clientes e tudo que relaciona a ele
app.get('/clientes-pedidos', async(req, res)=>{
    await cliente.findAll({include:[{all: true}]})
    .then(cli =>{
        return res.json({
            error: false,
            cli
        });
    }).catch((erro) => {
        return res.status(400).json({
            error: true,
            message:"Erro de conexão"
        });
    });
}); 


// contagem clientes
app.get('/ofertacliente', async(req, res)=>{
    await cliente.count('id').then(function(clientes){
        res.json({clientes});
    });
}); 


// Excluir cliente
app.get('/excluircliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then (function(){
        return res.json({
            error: false,
            message: "Cliente foi excluido com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível excluir o cliente."
        });
    });
});


// Atualizar Cliente
app.put('/cliente/:id', async (req, res)=>{
    const cli =  {
        id : req.params.id,
        nome : req.body.nome,
        endereco : req.body.endereco,
        cidade : req.body.cidade,
        uf : req.body.uf,
        nascimento : req.body.nascimento,
        clienteDesde : req.body.clienteDesde,
    };
    await cliente.update(cli, {
        where:{id: req.params.id}
    }).then (clientes=>{
        return res.json({
            error: false,
            message: "Cliente alterado com sucesso",
            clientes
        });
    }).catch(erro =>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar"
        });
    });
});





// inserindo pedido
app.post('/cliente/:id/pedido', async(req, res)=>{
    const ped={
        data: req.body.data,
        ClienteId: req.params.id
    };
    if(! await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Cliente não existe"
        });
    };
    await pedido.create(ped)
        .then(pedcli=>{
        return res.json({
            error: false,
            message: "Pedido inserido com sucesso",
            pedcli
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir o pedido"
        });
    });
});



// exibir todos os pedidos
app.get('/listapedidos', async(req, res)=>{
    await pedido.findAll({
        order: [['id', 'DESC']] //ordem decrescente//
    }).then(function(pedidos){
        res.json({pedidos})
    });
});



// contagem pedidos
app.get('/ofertapedido', async(req, res)=>{
    await pedido.count('id').then(function(pedidos){
        res.json({pedidos});
    });
}); 



// descobrir pedido pelo ID
app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id)
    .then(ped=>{
        return res.json({
            error: false,
            ped
        });
    }).catch(erro =>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar"
        });
    });
});


// todos os pedidos de 1 cliente
app.get('/cliente/:id/pedidos', async(req, res)=>{
    await pedido.findAll({
        where: {ClienteId: req.params.id}
    }).then (pedidos =>{
        return res.json({
            error: false,
            pedidos
        });
    }).catch(erro =>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});



// Alterar o pedido com base no ID do pedido 
app.put('/pedido/:id', async (req, res)=>{
    const ped =  {
        id : req.params.id,
        ClienteId: req.body.ClienteId,
        data: req.body.data
    };
    if(! await cliente.findByPk(req.body.ClienteId)){
        return res.status(400).json({
            error: true,
            message: "Cliente não existe"
        })
    }
    await pedido.update(ped, {
        where: Sequelize.and({ClienteId: req.body.ClienteId},
            {id: req.params.id})
    }).then (pedidos=>{
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso",
            pedidos
        });
    }).catch(erro =>{
        return res.status(400).json({
            error: true,
            message: "Nõ foi possível alterar"
        });
    });
});



// Exibir tudo relacionado a 1 pedido
app.get('/pedido/:id', async(req,res)=>{
    await pedido.findByPk(req.params.id, {include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    })
})


// Excluir pedido
app.get('/excluirpedido/:id', async(req, res)=>{
    await pedido.destroy({
        where: {id: req.params.id}
    }).then (function(){
        return res.json({
            error: false,
            message: "Pedido foi excluido com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível excluir o Pedido."
        });
    });
});




//inserir itempedido
app.post('/itempedidos', async(req, res)=>{
    await itempedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Itens inserido com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir os itens"
        });
    });
});


//Exibir todos os Itens pedidos
app.get('/listaItempedido', async(req, res)=>{
    await itempedido.findAll()
    .then(function(itensPedidos){
        res.json({itensPedidos})
    });
});


// Exibir todos os Itens Pedidos de 1 Pedido pelo Id
app.get('/pedido/:id/itemPedido', async(req, res)=>{
    await itempedido.findAll({
        where: {PedidoId: req.params.id}
    }).then (itensPedidos =>{
        return res.json({
            error: false,
            itensPedidos
        });
    }).catch(erro =>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});


// alterar item pedido
app.put('/pedidos/:id/editaritem', async(req, res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };
    if (! await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Pedido não foi encontrado."
        });
    };
    if (! await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            message: "Serviço não encontrado."
        });
    };
    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id})
    }).then (function(itens){
        return res.json({
            error: false,
            message: "Item pedido alterado com sucesso",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: Não foi possível alterar"
        });
    });
});


// Excluir ItemPedido
app.get('/excluirItemPedido/:id', async(req, res)=>{
    await itempedido.destroy({
        where: {PedidoId: req.params.id}
    }).then (function(){
        return res.json({
            error: false,
            message: "Item pedido foi excluido com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível excluir o item pedido."
        });
    });
});





// Inserir compra
app.post('/cliente/:id/compra', async(req, res)=>{
    const com={
        data: req.body.data,
        ClienteId: req.params.id
    };
    if(! await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Cliente não existe"
        });
    };
    await compra.create(ped)
        .then(comcli=>{
        return res.json({
            error: false,
            message: "compra inserida com sucesso",
            comcli
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir a compra"
        });
    });
});



// Lista compra
app.get('/listacompra', async(req, res)=>{
    await compra.findAll({
        order: [['id', 'DESC']] //ordem decrescente//
    }).then(function(compras){
        res.json({compras})
    });
});


// Atualizar compra
app.put('/compra/:id', async (req, res)=>{
    const com =  {
        id : req.params.id,
        ClienteId: req.body.ClienteId,
        data: req.body.data
    };
    if(! await cliente.findByPk(req.body.ClienteId)){
        return res.status(400).json({
            error: true,
            message: "Cliente não existe"
        })
    }
    await compra.update(com, {
        where: Sequelize.and({ClienteId: req.body.ClienteId},
            {id: req.params.id})
    }).then (compras=>{
        return res.json({
            error: false,
            message: "compra alterada com sucesso",
            compras
        });
    }).catch(erro =>{
        return res.status(400).json({
            error: true,
            message: "Nõ foi possível alterar"
        });
    });
});


// excluir compra
app.get('/excluircompra/:id', async(req, res)=>{
    await compra.destroy({
        where: {id: req.params.id}
    }).then (function(){
        return res.json({
            error: false,
            message: "Compra foi excluida com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível excluir a compra."
        });
    });
});




// Inserir produto
app.post('/produtos', async(req, res)=>{
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Produto criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar"
        });
    });
});


// Lista produtos
app.get('/listaprodutos', async(req, res)=>{
    await produto.findAll()
    .then(function(produtos){
        res.json({produtos})
    });
});


// Atualizar produtos
app.put('/atualizaprodutos', async(req, res)=>{
    await produto.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Produto arterado com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Houve erro na tentativa de alteração do Produto"
        });
    });
});


// Excluir produtos
app.get('/excluirProduto/:id', async(req, res)=>{
    await produto.destroy({
        where: {id: req.params.id}
    }).then (function(){
        return res.json({
            error: false,
            message: "Produto excluido com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível excluir o Produto."
        });
    });
});





// Inserir ItemCompra
app.post('/itemcompra', async(req, res)=>{
    await itemcompra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Itens da compra inserido com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível inserir os itens da compra"
        });
    });
});


// Listar ItemCompra
app.get('/compra/:id/itemCompra', async(req, res)=>{
    await itemcompra.findAll({
        where: {CompraId: req.params.id}
    }).then (itensCompras =>{
        return res.json({
            error: false,
            itensCompras
        });
    }).catch(erro =>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});


// Atualizar ItemCompra
app.put('/compras/:id/editaritem', async(req, res)=>{
    const comp={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };
    if (! await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Compra não foi encontrado."
        });
    };
    if (! await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            error: true,
            message: "Produto não encontrado."
        });
    };
    await itemcompra.update(item, {
        where: Sequelize.and({ProdutoId: req.body.ProdutoId},
            {CompraId: req.params.id})
    }).then (function(itens){
        return res.json({
            error: false,
            message: "Item compra alterado com sucesso",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: Não foi possível alterar"
        });
    });
});


// Excluir ItemCompra
app.get('/excluirItemCompra/:id', async(req, res)=>{
    await itemcompra.destroy({
        where: {CompraId: req.params.id}
    }).then (function(){
        return res.json({
            error: false,
            message: "Item compra foi excluido com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível excluir o item."
        });
    });
});




let port=process.env.PORT || 3001;

app.listen(port,(req, res)=>{
    console.log('Servidor ativo: http://localhost:3001');
})
 
