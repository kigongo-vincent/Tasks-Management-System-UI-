import React, { useState } from "react";
import Text from "./text";
import TableButton from "./table_button";
import { getRelativeTime } from "../utils/getRelativeTime";
import Switch from "../components/switch";
import { TextCropper } from "../utils/textCropper";
import { Theme, User } from "../types";
import { useSelector } from "react-redux";
import { getTheme, getUser } from "../model/data";
import { FaX } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

export interface Props {
  index: number,
  row: object;
  columns: string[];
  edit?: boolean;
  delete?: boolean;
  view?: true;
  redirect_path?: string;
  setActive?: (active: boolean) => void;
  showBody?: (data: any) => void;
  rows?: any[];
  setter?: any;
  editor: any;
  toggle?: any;
  cache: boolean
  move?: (payload: any)=>void
}

const row = (props: Props) => {
  const user: User = useSelector(getUser);
  const theme: Theme = useSelector(getTheme);
  const [open, setOpen] = useState(false);

  return (
    <AnimatePresence mode="sync">
      <tr className="shadow" style={{background: props?.index % 2 == 0 ? theme?.pale : ""}}>
        {props?.columns?.map((column, index) => (
          <td style={{ padding: "5px 10px" }}>
            <Text>
              {TextCropper(
                !column?.includes("date")
                  ? props?.row[column]
                  : getRelativeTime(props?.row[column]),
                60
              )}
            </Text>
          </td>
        ))}

        <td
          style={{
            padding: "7px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {props?.setActive && (
            <span style={{ marginRight: 20 }}>
              {
                (user?.role == "admin" || user?.role == "company_admin") && <Switch
                toggle={props?.toggle}
                is_active={props?.row["is_active"]}
                row={props?.row}
                rows={props?.rows}
              />
              }
            </span>
          )}
          <motion.div
            // whileHover={{background: theme?.pale}}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen(!open)}
            style={{
              position: "relative",
              display: "flex",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              // background: theme?.paper,
              padding: "7px 10px",
              borderRadius: 5,
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: 300,
                background: theme?.text,
              }}
            />
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: 300,
                margin: "5px 0",
                background: theme?.text,
              }}
            />
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: 300,
                background: theme?.text,
              }}
            />

            {/* menu */}
            {open && (
              <motion.div
                className="w-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute",
                  bottom: -30,
                  right: "0%",
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
                {/* view  */}
                {props?.view && (
                  <span>
                    <TableButton
                      setter={props?.setter}
                      showBody={props?.showBody}
                      redirect_path={props?.redirect_path}
                      mode="view"
                      row={props?.row}
                    />
                  </span>
                )}

                {/* edit  */}
                {((props?.edit &&
                  user?.role != "employee" &&
                  user?.role != "department_admin") || props?.cache) && (
                    <span>
                      <TableButton
                        editor={props?.editor}
                        setter={props?.setter}
                        mode="edit"
                        row={props?.row}
                      />
                    </span>
                  )}

                {/* delete  */}
                {((props?.delete && (user?.role == "admin" || user?.role == "company_admin")) || props?.cache) && (
                  <span>
                    <TableButton
                      setter={props?.setter}
                      mode="delete"
                      row={props?.row}
                    />
                  </span>
                )}
                {/*end menu body  */}
                {/* move  */}
                {((props?.move && (user?.role == "admin" || user?.role == "company_admin"))) && (
                  <span>
                    <TableButton
                      // setter={props?.setter}
                      move={props?.move}
                      mode="move"
                      row={props?.row}
                    />
                  </span>
                )}
                {/*end menu body  */}
              </motion.div>
            )}
          </motion.div>
        </td>
      </tr>
    </AnimatePresence>
  );
};

export default row;
