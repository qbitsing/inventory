const casual = require('casual')
const co = require('co')
const mongoose = require('mongoose')
const db = require('../bd.config.js')
const unidadesSchema = require('../models/unidades')
const CateriaSchema = require('../models/categorias')
const MateriaSchema = require('../models/materia-prima')
const ProdcutoSchema = require('../models/productos')
const SalidaSchema = require('../models/salidas')

mongoose.connect(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.data}`, (err , res) => {

  if(err){

    return console.log(`ERROR al conectar con la BD: ${err}`)

  }

  return seeder()

})

let seeder = co.wrap(function * (){

  try {

    let unidades = yield unidadesSchema.find()

    let categoriasInStore = yield CateriaSchema.find()

    for (let categoriaInStore of categoriasInStore) {
      yield CateriaSchema.findByIdAndRemove(categoriaInStore._id)
    }

    categoriasInStore =  null

    let categoriasToStore = new Array(10).fill().map(_ => new CateriaSchema({nombre: casual.word}))
    let categorias = []

    console.log('Creando Categorias')
    let con = 0
    for (let categoriaToStore of categoriasToStore) {
      con ++
      let cat = yield categoriaToStore.save()
      categorias.push(cat)
      console.log(`${con*10}%`)
    }

    console.log('Categorias Creadas Con Exito')

    console.log('Creando Materia Prima')

    con = 0

    let materiasInStore = yield MateriaSchema.find()

    for (let materiaInStore of materiasInStore) {
      yield MateriaSchema.findByIdAndRemove(materiaInStore._id)
    }

    materiasInStore = null

    let materiasToStore = new Array(200).fill().map(_ => new MateriaSchema({
      nombre: casual.word,
      min_stock: 100,
      cantidad: 1000,
      marca: casual.word,
      unidad_medida: unidades[Math.floor((Math.random() * unidades.length))]
    }))
    let materias = []

    for (let materiaToStore of materiasToStore) {
      con ++
      let mat = yield materiaToStore.save()
      materias.push(mat)
      console.log(`${(con*100)/200}%`)
    }

    console.log('Materia Prima Creada Con Exito')

    console.log('Creando Productos')

    con = 0

    let productosInStore = yield ProdcutoSchema.find()

    for (let productoInStore of productosInStore) {
      yield ProdcutoSchema.findByIdAndRemove(productoInStore._id)
    }

    productosInStore = null
    let productos = []

    let productosToStore = new Array(150).fill().map(_ => new ProdcutoSchema({
      nombre: casual.name,
      unidad_medida: unidades[Math.floor((Math.random() * unidades.length))],
      min_stock: 100,
      apartados: 0,
      cantidad: 1500,
      marca: casual.word,
      categoria: categorias[casual.integer(0, categorias.length -1)],
      precio: 15000,
      tipo: 'producto',
      fabricado: casual.integer(0,1)? true : false,
      comprado: true,
    }))

    for (let productoToStore of productosToStore) {
      con ++
      
      let prod = yield productoToStore.save()

      productos.push(prod)
      console.log(`${(con*100)/150}`)
    }

    console.log('Productos Creados con Exito')


  } catch (e) {

    console.log(e.message)

  }

  process.exit(0)

})
