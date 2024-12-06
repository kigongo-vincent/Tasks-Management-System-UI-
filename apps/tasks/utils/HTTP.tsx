// export const server_host = `https://tekjuice.pythonanywhere.com`
export const server_host = `http://localhost:8000`
export const server_url = `${server_host}/api/v1`

interface GETParams{
    setLoading: (loading: boolean)=>void,
    path: string,
    setData: (data: any)=>void,
    
}

interface UPDATEParams{
    setLoading: (loading: boolean)=>void
    payload: any
    setData: (data: any[])=>void
    data: any[]
    path: string
    setOpen?: (open: boolean)=>void
    successMessage?: ()=>void
    errorMessage?: ()=>void
}
interface DELETEParams{
    setData?: (data: any[])=>void
    data?: any[]
    path: string
    setOpen?: (open: boolean)=>void
    successMessage?: ()=>void
    errorMessage?: ()=>void,
    id: number,
}

export interface POSTParams{
    setLoading: (loading: boolean)=>void,
    path: string,
    setData: (data: any)=>void,
    data: any[],
    payload: object,
    setOpen?: (open: boolean) => void,
    successMessage?: ()=>void
    errorMessage?: ()=>void

}

export const GET =async(params:GETParams)=>{
    
    try{
        params?.setLoading(true)
        const res = await fetch(`${server_url}` + params?.path)
        const data = await res.json()
        params?.setData(data)
    }
    catch(error){
        console.log(error)
    }finally{
        params?.setLoading(false)
    }

}

export const POST =async(params: POSTParams)=>{
    try{
        params?.setLoading(true)
        const res = await fetch(`${server_url}` + params?.path, {
            method: "POST",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify(params?.payload)
        })
        if(res.status == 201){
        const data = await res.json()
        params?.setData([...params?.data, data])
        params?.setOpen && params?.setOpen(false)
        params?.successMessage && params?.successMessage()
        }else{
            // alert("failed!")
            params?.errorMessage && params?.errorMessage()
        }
    }
    catch(error){
        console.log(error)
        throw new error
    }finally{
        params?.setLoading(false)
    }
}

export const UPDATE =async(params: UPDATEParams)=>{
    try{
        params?.setLoading(true)
        const res = await fetch(`${server_url}` + params?.path, {
            method: "PATCH",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify(params?.payload)
        })
        if(res.status == 202){
        const data = await res.json()
        params?.setData(params?.data?.map(item => item?.id == data?.id ? data : item))
        params?.setOpen && params?.setOpen(false)
        }else{
            alert("failed!")
        }
    }
    catch(error){
        console.log(error)
        throw new error
    }finally{
        params?.setLoading(false)
    }
}

export const DELETE =async(params: DELETEParams)=>{
    try{
        params?.setData(params?.data?.filter(item => item?.id != params?.id))
        // params?.setLoading(true)
        const res = await fetch(`${server_url}` + params?.path, {
            method: "DELETE"
        })
        if(res.status == 202){
        const data = await res.json()
        params?.setOpen && params?.setOpen(false)
        params?.successMessage && params?.successMessage()

        }else{
            params?.errorMessage && params?.errorMessage()
        }
    }
    catch(error){
        params?.errorMessage && params?.errorMessage()
        throw new error
    }finally{
        // params?.setLoading(false)
    }
}