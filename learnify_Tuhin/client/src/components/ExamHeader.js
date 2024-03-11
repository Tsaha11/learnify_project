import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import './ExamCorner.css'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import detail from './examdata.json';
import { ToastContainer, toast } from 'react-toastify';
const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '43%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p:1
};
const ExamHeader = () => {
  const exams=["jee","neet","ctet","nda","upsc"];
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = React.useState(0);
  const [data,setData]=useState(detail);
  const [key,setKey]=useState(0);
  const syllabus=[false,false,false,false,false];
  const [age, setAge] = React.useState(10);
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const syllabusHandler=(env)=>{
    console.log(env.target.parentNode);
  }
  const jeeHandler=()=>{
    setValue(0);
  }
  const neetHandler=()=>{
    setValue(1);
  }
  const ctetHandler=()=>{
    setValue(2);
  }
  const ndaHandler=()=>{
    setValue(3);
  }
  const upscHandler=()=>{
    setValue(4);
  }
  useEffect(()=>{

  },[value])
  const [youtube,setYoutube]=useState([]);
  const [material,setMaterial]=useState([]);
  const fetchHandler=async()=>{
    console.log(value)
    try{
      const res=await fetch(`http://localhost:3000/instructor/youtube/${value}`,{
        method:"GET",
      })
      const data=await res.json();
      setMaterial(data.material)
      setYoutube(data.data)
    }catch(er){
      console.log("Error occured")
    }
  }
  useEffect(()=>{
    fetchHandler();
  },[value])
  const [channelname,setChannelName]=useState('');
  const [channellink,setChannelLink]=useState('');
  const [channelImgurl,setChannelImgurl]=useState('');
  const [loader,setLoader]=useState(false);
  const [file,setFile]=useState();
  const [pdftile,setPdftitle]=useState();
  const submitRef=React.useRef();
  const btnRef=React.useRef();
  const uploadHandler=async()=>{
    if(age===10){
      try{
        setLoader(true);
        btnRef.current.disabled=true;
        const response=await fetch("http://localhost:3000/instructor/youtube",{
            method:'POST',
            headers:{
              'Content-type':'application/json'
            },
            body:JSON.stringify({channelname:channelname,channellink:channellink,channelImgurl:channelImgurl,username:"inst",category:value})
        })
        setLoader(false);
        handleClose();
        toast.success("Youtube Channel Uploaded successfully",{
          position:'top-center'
        })
        fetchHandler();
      }
      catch(er){
        console.log("Error occured",er)
      }
      setOpen(false);
    }
    else if(age===20){
      try{
        setLoader(true);
        btnRef.current.disabled=true;
        const formData = new FormData();
        formData.append("title",pdftile)
        formData.append("pdf", file);  // Ensure "pdfFile" matches the field name
        formData.append("username","inst");
        formData.append("category",value)
        const response=await axios.post("http://localhost:3000/instructor/pdf", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Material Uploaded successfully",{
          position:'top-center'
        })
        fetchHandler();
      }
      catch(er){
        console.log("Error occured",er);
      }
      setOpen(false)
    }
  }
  const getTime = (data) => {
    const dateObject = new Date(data);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    var time = "";
    let period = hours >= 12 ? "PM" : "AM";
    time += `${hours}:${minutes} ${period}`;
    return time;
  };
  const getDate = (data) => {
    const dateObject = new Date(data);
    const year = dateObject.getUTCFullYear();
    const month = dateObject.getMonth() + 1;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = dateObject.getDate();
    var date = "";
    date += `${day},${monthNames[month - 1]} ${year}`;
    return date;
  };
  return (
    <div className='outer'>
      <ToastContainer/>
      <div className={"exam-container"}>
      <div className={"header"}>
          <div id="jee" onClick={jeeHandler} className={value===0?'active':''}>
            <span>JEE</span>
          </div>
          <div id="neet" onClick={neetHandler} className={value===1?'active':''}>
            <span>NEET</span>
          </div>
          <div onClick={ctetHandler} className={value===2?'active':''}>
            <span>CTET</span>
          </div>
          <div onClick={ndaHandler} className={value===3?'active':''}>
            <span>NDA</span>
          </div>
          <div onClick={upscHandler} className={value===4?'active':''}>
            <span>UPSC</span>
          </div>
        </div>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            ref={submitRef}
          >
            <Box sx={style}>
              <div className='select-div'>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 190 }}>
                  <InputLabel id="demo-simple-select-standard-label">Select Resource Type:</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={age}
                    onChange={handleChange}
                    label="Age"
                  >
                    <MenuItem value={10}>Youtube Channel</MenuItem>
                    <MenuItem value={20}>PDF Material</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {age===10 && <><div className='link-div'>
                <label>Enter the Channel Name</label><br></br>
                <input onChange={(env)=>{setChannelName(env.target.value)}} placeholder='Name of the Channel'></input>
              </div>
              <div className='link-div'>
                <label>Paste the channel link</label><br></br>
                <input onChange={(env)=>{setChannelLink(env.target.value)}} placeholder='Channel link'></input>
              </div>
              <div className='link-div'>
                <label>Paste the image link</label><br></br>
                <input onChange={(env)=>{setChannelImgurl(env.target.value)}} placeholder='Image url'></input>
              </div></>}
              {age===20 && <><div className='link-div'>
                <label>Enter the Topic Name</label><br></br>
                <input onChange={(env)=>{setPdftitle(env.target.value)}} placeholder='Name of the Topic'></input>
              </div>
              <div className='link-div'>
                <label>Upload file</label><br></br>
                <input onChangetype='file' className='input-file'></input>
                <input onChange={(env)=>{setPdftitle(env.target.value)}} placeholder='Name of the Topic'></input>
              </div>
              <div className='link-div'>
                <label>Upload file</label><br></br>
                <input onChange={(env)=>{setFile(env.target.files[0])}} type='file' className='input-file'></input>
              </div>
              </>}
              <div className='submit-btn'>
                <button class="button-26" ref={btnRef} role="button" onClick={uploadHandler}>{!loader && "Upload"}{loader && <div className='loader'>Loader...</div>}</button>
              </div>
            </Box>
          </Modal>
        </div>
        <div className={"blog-card"}>
          <input type="radio" name="select" id="tap-1" checked></input>
          <input type="checkbox" id="imgTap"></input>
          <div className={"inner-part"}>
            <label for="imgTap" class="img">
              <img className={"img-1"} alt="" src={data[value].examImg}></img>
            </label>
            <div className={"content content-1"}>
              <div className={"title"}>{data[value].examName}</div>
              <h3>Registration Date</h3>
              <div className={"text"}>{data[value].examReg}</div>
              <h3>Exam Date</h3>
              <div className={"text"}>{data[value].examDate}</div>
              <h3>Role/Position offered</h3>
              <div className={"text"}>{data[value].examRole}</div>
              <h3>Official Website Link</h3>
              <div className={"text"}>Follow this <a href={data[value].examUrl} target="_blank">Link</a></div>
              <h3 style={{"margin":"0px"}}>Syllabus</h3>
              <div className={"text"}>
                <a href="" target="_blank">
                <label style={{"fontSize":"0.85em"}} className="linkSyllabus">To know more </label>
                </a>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div className={"resourceContainer"}>
        <div className='material-header'>
          <h2>Best Resouces Channel</h2>
          <AddIcon className='upload-btn' onClick={handleOpen}/>
        </div>
        <div className={"channel1"}>
          {
            youtube.map((obj)=>(
              <div className='cards'>
                <a href={obj.channelLink} target='_blank'>
                <div className='image'>
                  <img src={obj.imageUrl}></img>
                </div>
                <div className='text'>
                  <h6>{obj.channelname}</h6>
                  <p>Suggested by <strong>{obj.username}</strong></p>
                </div>
                </a>
              </div>
            ))
          }
        </div>
        <h2>Best resources</h2>
        <div>
    </div>
        <div className={"channel1"}>
          {
            material.map((obj)=>(
              <div className='cards' key={obj._id}>
                <a href={obj.link} target='_blank'>
                <div className='image'>
                    <img src='/profile-13.png'></img>
                  </div>
                  <div className='text'>
                    <h6>{obj.title}</h6>
                    <p>Uploaded by <strong>{obj.username}</strong> on <span className='time'>{getTime(obj.createdAt)} {getDate(obj.createdAt)}</span></p>
                  </div>
                </a>
              </div>
            ))
          }
          </div>
      </div>
      </div>

    </div>
  );
};
export default ExamHeader;
