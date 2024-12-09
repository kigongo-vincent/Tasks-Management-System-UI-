import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTheme } from "../model/data";
import Text from "./text";
import Row from "./row";
import { FaFilter, FaSort, FaX } from "react-icons/fa6";
import { Theme } from "../types";
import { motion } from "framer-motion"

export interface Props {
  columns: string[];
  rows: any[];
  edit?: boolean;
  delete?: boolean;
  view?: true;
  redirect_path?: string;
  setActive?: (active: boolean) => void;
  showBody?: (data: any) => void;
  setter: any;
  editor: any;
  toggle: any;
  cache: boolean;
  move?: (payload: any) => void
  info?: (payload: any) => void
  filterOptions?: any[]
  currentFilter?: string
}

const Table = (props: Props) => {
  const theme: Theme = useSelector(getTheme);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    console.log(open)
  }, [open])

  return (
    <table
      border={1}
      cellSpacing={0}
      cellPadding={0}
      style={{
        width: "100%",
        marginTop: 10,
        borderColor: "rgba(0,0,0,.05)",
        // overflow: "hidden",
        background: theme?.paper,
        // boxShadow: "10px 10px 20px rgba(0,0,0,.05)",
        borderRadius: 4,
      }}
    >
      {/* table header  */}
      <tr style={{ background: theme?.primary }}>
        {/* columns  */}
        {props?.columns?.map((column) => (
          <td style={{ padding: "7px 10px" ,width: "max-content", minWidth: "max-content"}}>
            <Text color="white">
              {
                column == "project_name"
                  ?
                  "PROJECT"
                  :
                  column == "admin_email" ? "EMAIL" : column == "admin_contact" ? "CONTACT" : column?.toLocaleUpperCase()?.replace("_", " ")}
            </Text>
          </td>
        ))}

        {(props?.view || props?.edit || props?.delete || props?.setActive) && (
          <td style={{ padding: "5px 10px", display: "flex", justifyContent: "flex-end", position: "relative" }}>
            
            {
              props?.filterOptions && <div onClick={() => setOpen(true)} style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                border: `1px solid ${theme?.name == "dark" ? theme?.placeholder: theme?.pale}`,
                padding: "7px 20px",
                borderRadius: 4
              }}>
                <FaSort color={theme?.name == "dark" ? theme?.text: theme?.paper} style={{ marginRight: 5 }} />
                <Text color={theme?.name == "dark" ? "text" : "white"}>Sort</Text>
              </div>
            }

            {/* menu */}
            {(props?.filterOptions && open) && (
              <motion.div
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-15"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "10%",
                  padding: 20,
                  backgroundColor: theme?.paper,
                  zIndex: 4,
                  boxShadow:
                    "10px 10px 20px rgba(0,0,0,.1), -10px -10px 20px rgba(0,0,0,.1)",
                }}
              >
                {/* menu header  */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginBottom: 10,
                  }}
                >
                  <FaX
                    color={theme?.placeholder}
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpen(false)}
                    size={15}
                  />
                </div>

                {/* menu body  */}
                {
                  props?.filterOptions && props?.filterOptions?.map(option => (
                    <motion.div
                      whileHover={{ background: theme?.pale }}
                      onClick={option?.action}
                      style={{
                        background: theme?.paper,
                        padding: "10px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        // width: "max-content",
                        opacity: props?.currentFilter == option?.label ? 1 : .5,
                        cursor: "pointer",
                      }}
                    >
                      {option?.icon}
                      <div style={{ margin: "0 5px" }} />
                      <Text>{option?.label}</Text>
                    </motion.div>
                  ))
                }
                {/*end menu body  */}
              </motion.div>
            )}

          </td>
        )}
      </tr>

      {/* rows  */}
      {props?.rows?.map((row, index) => (
        <Row
          index={index}
          toggle={props?.toggle}
          cache={props?.cache}
          editor={props?.editor}
          setter={props?.setter}
          rows={props?.rows}
          showBody={props?.showBody}
          setActive={props?.setActive}
          redirect_path={props?.redirect_path}
          key={index}
          row={row}
          info={props?.info}
          columns={props?.columns}
          edit={props?.edit}
          view={props?.view}
          delete={props?.delete}
          move={props?.move}
        />
      ))}
    </table>
  );
};

export default Table;
