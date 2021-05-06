import React from 'react'
import { Card, ListGroup } from 'react-bootstrap'

function Features(){
    return (
        <div>
            <Card style={{paddingTop: '15px',width:'50%', margin: 'auto', marginTop: '45px'}}>
                <Card.Title>Extra Features</Card.Title>
                <Card.Body>
                    <ListGroup>
                        <ListGroup.Item style={{textAlign : 'left'}}>
                        1) User-specialized data -> I thought for such a simple site, users
                        would not want to go through the whole hassle of signing up and signing in.
                        So, I used their local machine IP addresses to differentiate users. Their 
                        IP Addresses are stored in a MongoDB database, but they're hashed with md5, so
                        no one would be able to see the actual IP address. This implies that I have added
                        a back end.
                        </ListGroup.Item>
                        <ListGroup.Item style={{textAlign : 'left'}}>
                        2) If you hover over the movie title, an overlay appears
                        showing some details (poster, description, actors) about the movie.

                        </ListGroup.Item>
                        <ListGroup.Item style={{textAlign : 'left'}}>
                        3) Created a logo that is animated with CSS on the top left
                        </ListGroup.Item>
                        <ListGroup.Item style={{textAlign : 'left'}}>
                        4) Loading Page with Animation (CSS) - Only appears on a new tab, not reload (Implemented using browser session storage) 

                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Features