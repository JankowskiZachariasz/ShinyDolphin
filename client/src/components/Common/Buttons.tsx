
export const AccentButton = (props :{
    text: string, 
    href: string, 
    handleClick : (event: React.MouseEvent<HTMLElement>) => void
}) =>{
    return (
        <button 
            onClick={props.handleClick}
            onMouseDown = {(event: React.MouseEvent<HTMLElement>) => { event.preventDefault()}}
            className = "rounded-md mr-2 px-3 py-2 text-xs font-semibold text-slate-300 shadow-sm border-slate-300 border-solid border-2 hover:text-white hover:border-white ">
            {props.text}
        </button>
    )
  }