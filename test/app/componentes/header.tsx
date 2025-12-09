
function Header() {
  return (
    <div className='w-full bg-violet-800 h-12 flex justify-center items-center'>
        <div className=''>
            <nav className='text-white gap-10 flex text-1xl cursor-pointer'>
            <a className='hover:text-violet-400 ' href="#Home">Home</a>
            <a className='hover:text-violet-400 ' href="/teste1">Teste1</a>
            <a className='hover:text-violet-400 ' href="/teste2">Teste2</a>
            <a className='hover:text-violet-400 ' href="/teste3">Teste3</a>
            </nav>
            
        </div>

         <h1 className= 'absolute text-white text-2xl right-4'> Lincoln Gasparin</h1>
       
      
    </div>
  )
}

export default Header
