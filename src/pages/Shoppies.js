import React, {useState, useRef, useEffect} from 'react'
import {Image, Popover, OverlayTrigger, Card, InputGroup, FormControl, Container, Col, Row, ListGroup} from 'react-bootstrap'
import axios from 'axios'

function Shoppies(){


    const [movieIDs, setMovieIDs] = useState([])

    const movieIDHandler = (arr) => {
        setMovieIDs(arr)
    }

    const myRefs = useRef([])


    const [searchResults, setResults] = useState([])

    const[popMovie, setMovie] = useState({})

    const [nominations, setNominations] = useState([])

    const addNomination = (event, movie) => {
        axios.post(process.env.REACT_APP_API+'/api/nomination/nominate', {'movieID': movie.imdbID}).then(response => {
            console.log();
        })
        event.target.disabled = true
        setNominations(prevArr => {
            return prevArr.concat(movie)
        })
    }

    const removeNomination = (movie) => {
        axios.post(process.env.REACT_APP_API+'/api/nomination/remove', {'movieID': movie.imdbID}).then(response => {
            console.log();
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
        axios.get(process.env.REACT_APP_API+'/api/nomination/getNominations').then(response => {
            let arr = []
            response.data.nominations.forEach(nomination => {
                arr.push(nomination.imdbID)
            });
            movieIDHandler(arr)
            setNominations(response.data.nominations)
        })
    }, [])

    const popMovieHandler = (obj) => {
        setMovie(obj)
    }

    const resultsHandler = (arr) => {
        setResults(arr)
    }

    const searchHandler = (event) => {
        axios.get('https://www.omdbapi.com/?s='+event.target.value+'&apikey='+process.env.REACT_APP_OAPI).then(response => {
            if (response.data.Response === 'True'){
                resultsHandler(response.data.Search)
            } 
            else resultsHandler([])
        })
    }

    const movieHoverHandler = (event) => {
        axios.get('https://www.omdbapi.com/?i='+event.imdbID+'&apikey='+process.env.REACT_APP_OAPI).then(response => {
            let obj = {...event}
            obj.Plot = response.data.Plot
            obj.Actors = response.data.Actors
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
    return (
        <div style={{paddingTop: '65px'}}>
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