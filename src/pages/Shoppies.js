import React, {useState, useRef, useEffect} from 'react'
import {Image, Popover, OverlayTrigger, Button, Card, InputGroup, FormControl, Container, Col, Row, ListGroup, Modal} from 'react-bootstrap'
import axios from 'axios'

function Shoppies(){


    const [movieIDs, setMovieIDs] = useState([])
    const [email, setEmail] = useState("")

    const emailChangeHandler = (event) => {
        console.log('here');
        console.log(event);
        console.log(event.target.value);
        setEmail(event.target.value)
    }


    const movieIDHandler = (arr) => {
        setMovieIDs(arr)
    }

    const [showDoneAlert, setDoneAlert] = useState(false)
    const handleDoneShow = () => setDoneAlert(true)
    const handleDoneClose = () => setDoneAlert(false)

    const [showFinAlert, setFinAlert] = useState(false)
    const handleFinShow = () => setFinAlert(true)
    const handleFinClose = () => setFinAlert(false)

    const [showEmailPopup, setEmailPopup] = useState(false)
    const handleEmailShow = () => setEmailPopup(true)
    const handleEmailClose = () => setEmailPopup(false)

    const myRefs = useRef([])


    const [searchResults, setResults] = useState([])

    const[popMovie, setMovie] = useState({})

    const [nominations, setNominations] = useState([])

    const [lastClickedMovie, setLastMovie] = useState({})

    const addNomination = (event, movie) => {
        console.log('here', localStorage.getItem('email'));
        if (nominations.length === 5){
            // alert("You have reached your limit of 5 ")
            handleDoneShow()
            return
        }
        else{
            if (localStorage.getItem('email') === null){
                console.log('here', localStorage.getItem('email'));
                setLastMovie(movie)
                handleEmailShow()
                return
            }
            else{
            axios.post(process.env.REACT_APP_API+'/api/nomination/nominate', {'movieID': movie.imdbID, 'email': localStorage.getItem('email')}).then(response => {
                console.log(response);
            })
            event.target.disabled = true
            setNominations(prevArr => {
                if (prevArr.length === 4) {
                    handleFinShow()
                }
                return prevArr.concat(movie)
            })
        }
    }
    }

    const removeNomination = (movie) => {
        axios.post(process.env.REACT_APP_API+'/api/nomination/remove', {'movieID': movie.imdbID}).then(response => {
            console.log(response);
        })
        let arr = [...nominations]
        const index = arr.indexOf(movie)
        arr.splice(index,1)
        if (movieIDs.includes(movie.imdbID)){
            movieIDs.splice(movieIDs.indexOf(movie.imdbID), 1)
        }
        setNominations(arr)
        if (!(myRefs.current[movie.imdbID] === undefined || myRefs.current[movie.imdbID] === null)){
            myRefs.current[movie.imdbID].disabled = false
        }
    }

    useEffect(()=>{
        console.log(localStorage.getItem('email'));
        if (localStorage.getItem('email')){
            axios.get(process.env.REACT_APP_API+'/api/nomination/getNominations/'+localStorage.getItem('email')).then(response => {
                let arr = []
                response.data.nominations.forEach(nomination => {
                    arr.push(nomination.imdbID)
                });
                movieIDHandler(arr)
                setNominations(response.data.nominations)
            })
    }
    }, [])

    const popMovieHandler = (obj) => {
        setMovie(obj)
    }

    const resultsHandler = (arr) => {
        setResults(arr)
    }

    const searchHandler = (event) => {
        axios.get('https://www.omdbapi.com/?s='+event.target.value+'&apikey=4bf894c9').then(response => {
            console.log(response.data);
            if (response.data.Response === 'True'){
                resultsHandler(response.data.Search)
            } 
            else resultsHandler([])
        })
    }

    const movieHoverHandler = (event) => {
        axios.get('https://www.omdbapi.com/?i='+event.imdbID+'&apikey=4bf894c9').then(response => {
            let obj = {...event}
            obj.Plot = response.data.Plot
            obj.Actors = response.data.Actors
            console.log(obj);
            popMovieHandler(obj)
        }) 
    }

    const popover = (
        <Popover id="popover-basic">
        <Popover.Title as="h3">{popMovie.Title} ({popMovie.Year})</Popover.Title>
        <Popover.Content>
        {/* <img src={popMovie.Poster} style={{height: '100%'}}/> */}
        <Image src={popMovie.Poster} style={{height: '330px'}}/>
        <hr/>
        <h6>Description</h6>
        <p>{popMovie.Plot}</p>
        <hr/>
        <h6>Actors</h6>
        <p>{popMovie.Actors}</p>
        </Popover.Content>
        </Popover>
      );

    const [codePopup, showCodePopup] = useState(false)
    const handleCodePopupShow = () => showCodePopup(true)
    const handleCodePopupClose = () => showCodePopup(false)
    
    const [codeInput, setCodeInput] = useState('')
    const codeInputChangeHandler = (event) => {
        console.log('here');
        setCodeInput(event.target.value)
        console.log(event);
        console.log('here');
    }

    const [code, setCode] = useState('')

    const sendCodeHandler = () => {
        console.log(email);
        axios.post(process.env.REACT_APP_API+'/api/auth/sendCode', {email: email}).then(response => {
            if (response.data.status == "invalid"){
                alert('Email does not exist')
            }
            else{
                console.log(response);
                handleEmailClose()
                handleCodePopupShow()
                setCode(response.data.code)
            }
        })
    }

    const submitCodeHandler = () => {
        console.log('here');
        console.log(code);
        console.log(codeInput);
        if (code === codeInput){
            
            axios.post(process.env.REACT_APP_API+'/api/auth/login', {email: email, lastClickedMovie: lastClickedMovie}).then(response =>{
                console.log(response);
                localStorage.setItem('email', email)
                window.location = '/'
            })
        }
        else{
            alert("Code is incorrect!")
        }
    }

    const emailChange = (event) => {
        console.log('here');
        console.log(event);
    }

    return (
        <div style={{paddingTop: '65px'}}>
            <Modal show={showDoneAlert} onHide={handleDoneClose}>
                <Modal.Header closeButton>
                <Modal.Title>Whoops!</Modal.Title>
                </Modal.Header>
                <Modal.Body>You have already reached your limit of 5 nominations!</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleDoneClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showFinAlert} onHide={handleFinClose}>
                <Modal.Header closeButton>
                <Modal.Title>Congratulations!</Modal.Title>
                </Modal.Header>
                <Modal.Body>You are finished nominating! Thank you for participating.</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleFinClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEmailPopup} onHide={handleEmailClose}>
                <Modal.Header closeButton>
                <Modal.Title>Please provide email.</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    

                    
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Example: isfaroshir@gmail.com"
                    aria-label="Email"
                    aria-describedby="basic-addon1"
                    name="email23"
                    onChange={emailChangeHandler}
                    />
                </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleEmailClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendCodeHandler}>Send Code</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={codePopup} onHide={handleCodePopupClose}>
                <Modal.Header closeButton>
                <Modal.Title>Please provide the emailed code. {codePopup}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Code</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Code"
                    aria-label="Email"
                    name="pass23"
                    aria-describedby="basic-addon1"
                    onChange={codeInputChangeHandler}
                    />
                </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCodePopupClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={submitCodeHandler}>Submit Code</Button>
                </Modal.Footer>
            </Modal>
        
            <Card style={{ borderRadius: '5px', width:'60%', margin: 'auto' }}>
                <Card.Body>
                    <Card.Title style={{textAlign:"left"}}>Search</Card.Title>
                    <InputGroup className="mb-3" style={{'width': '100%'}}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Movie Title</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder="Example: The Avengers"
                        aria-label="Username"
                        name="movieTitle"
                        aria-describedby="basic-addon1"
                        onChange={searchHandler}
                        />
                    </InputGroup>
                </Card.Body>
            </Card>

            <Container style={{marginTop: '10vh', overflowX: 'hidden', width: '60%', padding:'0'}}>
                <Row md={2}>
                    <Col xs>
                        <Card className="hoverEffect" style={{ borderRadius: '10px' }}>
                            <Card.Body>
                            <Card.Title style={{textAlign: 'left'}}>Results for </Card.Title>
                            <Card.Text>
                            
                            </Card.Text>
                            <ListGroup style={{border: 'none'}}>
                                {searchResults.map((movie) => {
                                    return (
                                        <ListGroup.Item>
                                            <OverlayTrigger placement="right" overlay={popover}>
                                                <h5 className="btn-roboto" variant="success" onMouseEnter={() => movieHoverHandler(movie)}>{movie.Title+' ('+movie.Year+')'}</h5>
                                            </OverlayTrigger>
                                            {(movie in nominations) || (movieIDs.includes(movie.imdbID)) ?
                                            <button className="btn-style" ref={(el) => (myRefs.current[movie.imdbID] = el)} onClick={(event)=> addNomination(event,movie)} disabled>
                                                Nominate
                                            </button>
                                            : 
                                            <button className="btn-style" ref={(el) => (myRefs.current[movie.imdbID] = el)} onClick={(event)=> addNomination(event, movie)}>
                                                Nominate
                                            </button>
                                            }
                                        </ListGroup.Item>
                                    )
                                })

                                }
                            </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs>
                    <Card className="hoverEffect" style={{ borderRadius: '10px' }}>
                            <Card.Body>
                            <Card.Title style={{textAlign: 'left'}}>Nominations </Card.Title>
                            <Card.Text>
                            
                            </Card.Text>
                            <ListGroup style={{border: 'none'}}>
                            {nominations.map((movie) => {
                                    return (
                                        <ListGroup.Item>
                                            <OverlayTrigger placement="right" overlay={popover}>
                                                <h5 className="btn-roboto" variant="success" onMouseEnter={() => movieHoverHandler(movie)}>{movie.Title+' ('+movie.Year+')'}</h5>
                                            </OverlayTrigger><button className="btn-style" onClick={()=> removeNomination(movie)}>Remove</button>
                                        </ListGroup.Item>
                                    )
                                })

                                }
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Shoppies