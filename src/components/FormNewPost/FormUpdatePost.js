import { useState, useEffect } from "react";

import FormProductDetail from "./FormProductDetail";
import FormProductDescription from "./FormProductDescription";
import Confirm from "./Confirm";
import Success from "./Success";
import validate from "./Validation";
import axios from "axios";
import { useParams } from 'react-router-dom'

function updatePost(post) {
  async function putData(url = "", data = {}) {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhlbnJ5Iiwicm9sIjoidXNlciIsImlhdCI6MTY0MzM4MjM1NiwiZXhwIjoxNjQzNDY4NzU2fQ.7g_5dSTr14AEuDTCC3T4AuKksEZLmDXOLXL4fcEB_xE"

        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  putData('http://localhost:4000/api/admin/post', post)
      .then((json) => {
       alert(json.msg)
      })
      .catch(err=>console.log("server response error",err));

  // axios.put('http://localhost:4000/api/admin/post', {
  //   data:post,
  //   headers:{
  //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhlbnJ5Iiwicm9sIjoidXNlciIsImlhdCI6MTY0MzM4MjM1NiwiZXhwIjoxNjQzNDY4NzU2fQ.7g_5dSTr14AEuDTCC3T4AuKksEZLmDXOLXL4fcEB_xE"
  //   }
  // })
}



export default function FormNewPost() {

  const {id}= useParams()
  let [allCategories, setAllCategories] = useState([]);

  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [input, setInput] = useState({
    title: '',
    Categories: [],
    condition: "",
    stock: "",
    description: "",
    price: "",
    Images:[]
  });

  useEffect(() => {
    async function fetchData() {
      // You can await here
      // ...
      let {data} = await axios.get("http://localhost:4000/api/posts/"+id)
      let allCategories = await axios.get("http://localhost:4000/api/category").then(res=>res.data)
      setAllCategories(allCategories)

      setInput({
       ...data,
       title: data.name,
       Images: data.Images.map(i=>i.link),
       Categories:data.Categories.map(c=>c.id.toString())

     })
  
    }
    fetchData()

    }, [])
  // Proceed to next step
  const nextStep = () => {
    setStep(step + 1)
  };

  // Go to previous step
  const prevStep = () => {
    setStep(step - 1)
  };

  // Handle field changes
  const handleChange = (e) => {
    setInput((input) => {
      const { name, value } = e.target
      return {
        ...input,
        [name]: value,
      }
    })
  }
   const deleteMultiOption =(name,value)=>{
     console.log(value)
    setInput((input) => {
      return {
        ...input,
        [name]: input[name].filter(e=>e!=value),
      }
    })
   }
  // Handle multioptio like images or categories
  const handleMultiOption = (e) => {
    setInput((input) => {
      const { name, value } = e.target
      return {
        ...input,
        [name]: [...input[name], value],
      }
    })
  };

  // Handle errors by blur event
  const handleBlur = () => {
    setErrors(validate(input));
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    updatePost({...input, name:input.title})
    // setInput({
    //   title: "",
    //   categoryId: "",
    //   condition: "",
    //   stock: "",
    //   images: "",
    //   description: "",
    //   price: "",
    // });
    alert(input.Images)
  };

  switch (step) {
    case 1:
      return (
        <FormProductDetail
          nextStep={nextStep}
          handleChange={handleChange}
          handleBlur={handleBlur}
          input={input}
        />
      );
    case 2:
      return (
        <FormProductDescription
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          handleMultiOption={handleMultiOption}
          deleteMultiOption={deleteMultiOption}
          handleBlur={handleBlur}
          input={input}
          allCategories={allCategories}
        />
      );
    case 3:
      return (
        <Confirm
          nextStep={nextStep}
          prevStep={prevStep}
          input={input}
          handleSubmit={handleSubmit}
        />
      );
    case 4:
      return <Success />;
    default:
      return null;
  }
}
