import React from "react";
import { useSelector } from "react-redux";
import { getTheme } from "../model/data";
import Text from "./text";
import Row from "./row";

export interface Props {
  columns: string[];
  rows: any[];
  edit?: boolean;
  delete?: boolean;
  view?: true;
  redirect_path?: string,
  setActive?: (active: boolean)=>void
  showBody?: (data: any)=>void
  setter: any,
  editor: any,
  toggle: any
}

const Table = (props: Props) => {
  const theme = useSelector(getTheme);
  return (
    <table
      cellSpacing={0}
      style={{
        width: "100%",
        marginTop: 10,
        overflow: "hidden",
        background: theme?.paper,
        boxShadow: "10px 10px 20px rgba(0,0,0,.05)",
        borderRadius: 4,
      }}
    >
      {/* table header  */}
      <tr style={{ background: theme?.primary }}>
        {/* columns  */}
        {props?.columns?.map((column) => (
          <td style={{ padding: 15 }}>
            <Text color="white">{column}</Text>
          </td>
        ))}

        {
          (props?.view || props?.edit || props?.delete || props?.setActive) && <td style={{ padding: 15 }}></td>
        }

       
      </tr>

      {/* rows  */}
      {props?.rows?.map((row, index) => (
        <Row toggle={props?.toggle} editor={props?.editor} setter={props?.setter} rows={props?.rows} showBody={props?.showBody} setActive={props?.setActive} redirect_path={props?.redirect_path} key={index} row={row} columns = {props?.columns} edit={props?.edit} view ={props?.view} delete={props?.delete}/>
      ))}
    </table>
  );
};

export default Table;
