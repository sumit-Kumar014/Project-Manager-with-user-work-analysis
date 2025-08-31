
interface Props {
    color: string;
    name: string;
}

const WorkspaceAvatar = ({color, name}: Props) => {
  return (
    <div className="w-6 h-6 rounded flex items-center justify-center" style={{backgroundColor:color}} >
        <span className="text-xs font-medium text-white"> {name.charAt(0).toUpperCase()} </span>
    </div>
  )
}

export default WorkspaceAvatar
