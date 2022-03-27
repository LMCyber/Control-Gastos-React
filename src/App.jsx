import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { ListadoGastos } from './components/ListadoGastos'
import { Modal } from './components/Modal'

import { generarId } from './helpers'
import IconoNuevoGasto from './img/nuevo-gasto.svg'

function App () {
  const [presupuesto, setPresupuesto] = useState(Number(window.localStorage.getItem('presupuesto')) ?? 0)
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)
  const [modal, setModal] = useState(false)
  const [animarModal, setAnimarModal] = useState(false)
  const [gastos, setGastos] = useState(window.localStorage.getItem('gastos') ? JSON.parse(window.localStorage.getItem('gastos')))
  const [gastoEditar, setGastoEditar] = useState({})

  useEffect(() => {
    if (Object.keys(gastoEditar).length > 0) {
      setModal(true)

      setTimeout(() => {
        setAnimarModal(true)
      }, 100)
    }
  }, [gastoEditar])

  useEffect(() => {
    window.localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto])

  useEffect(() => {
    window.localStorage.setItem('gastos', JSON.stringify(gastos) ?? [])
  }, [gastos])

  useEffect(() => {
    const presupuestoLS = Number(window.localStorage.getItem('presupuesto'))

    if (presupuestoLS > 0) {
      setIsValidPresupuesto(true)
    }
  }, [])

  const handleNuevoGasto = () => {
    setModal(true)
    setGastoEditar({})

    setTimeout(() => {
      setAnimarModal(true)
    }, 100)
  }

  const guardarGasto = (gasto) => {
    if (gasto.id) {
      const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState)

      setGastos(gastosActualizados)
      setGastoEditar({})
    } else {
      gasto.id = generarId()
      gasto.fecha = Date.now()
      setGastos([...gastos, gasto])
    }

    setModal(false)

    setTimeout(() => {
      setAnimarModal(false)
    }, 100)
  }

  const eliminarGasto = (id) => {
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id)

    setGastos(gastosActualizados)
  }

  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        gastos={gastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />

      {isValidPresupuesto && (
        <>
          <main>
            <ListadoGastos
              gastos={gastos}
              setGastoEditar={setGastoEditar}
              eliminarGasto={eliminarGasto}
            />
          </main>

          <div className='nuevo-gasto'>
            <img src={IconoNuevoGasto} alt='Icono nuevo gasto' onClick={handleNuevoGasto} />
          </div>
        </>
      )}

      {modal && <Modal
        setModal={setModal}
        animarModal={animarModal}
        setAnimarModal={setAnimarModal}
        guardarGasto={guardarGasto}
        gastoEditar={gastoEditar}
        setGastoEditar={setGastoEditar}
                />}
    </div>
  )
}

export default App
