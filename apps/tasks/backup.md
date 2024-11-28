<td style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end"
        }}>
          {/* view  */}
        {props?.view &&  (
          <span style={{ padding: 15 }}>
            <TableButton setter={props?.setter} showBody={props?.showBody} redirect_path={props?.redirect_path} mode="view" row={props?.row}/>
          </span>
        )}

        {
          props?.setActive && <td><Switch toggle={props?.toggle} is_active={props?.row["is_active"]}  row={props?.row} rows={props?.rows}/></td>
        }

        {/* edit  */}
        {props?.edit && user?.role !="employee" && user?.role != "department_admin"  && (
          <span style={{ padding: 15 }}>
            <TableButton editor={props?.editor} setter={props?.setter}  mode="edit" row={props?.row} />
          </span>
        )}

        {/* delete  */}
        {props?.delete && user?.role != "employee" && (
          <span style={{ padding: 15 }}>
            <TableButton setter={props?.setter} mode="delete" row={props?.row} />
          </span>
        )}
        </td>