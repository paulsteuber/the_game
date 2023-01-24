export function Card(props:{cardValue:string | number, type: string}){
  let classNamesWrapper = "";

  switch(props.type) {
    case "normal":
      classNamesWrapper = "user-card rounded-2 shadow py-4"
      break;
    default:
      classNamesWrapper = "user-card rounded-2 shadow py-4"
  } 

  return (<div className={classNamesWrapper+" card d-flex justify-content-center align-items-center"}>
  <span className="h1 fw-bolder m-0 p-4">{props.cardValue}</span>
</div>)
}