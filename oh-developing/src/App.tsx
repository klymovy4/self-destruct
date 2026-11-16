import './App.css'
import { NavLink, Route, Routes } from 'react-router'
import { Search } from './components/search/Search'
import ItemList from './components/itemList/ItemList'
import {SearchTanstack} from './components/searchTanstack/SearchTanStack'

function App() {
  return (
    <>
      <nav className='navWrapper'>
        <NavLink to='/search'>Search</NavLink>
        <NavLink to='/search-tanstack'>Search Tanstack</NavLink>
        <NavLink to='/search-rtkquery'>Search rtk-query</NavLink>
        <NavLink to='/todos'>Todos</NavLink>
      </nav>

      <Routes>
        <Route path='/search' element={<Search section='products' />} />
        <Route path='/search-tanstack' element={<SearchTanstack section='products' />} />

        <Route path='/todos' element={<ItemList />} />
        <Route path='*' element={<p>Page not found</p>} />
      </Routes>
    </>
  )
}

export default App
