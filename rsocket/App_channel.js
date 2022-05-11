import { Component } from "react";
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { RSocketClient, BufferEncoders, JsonSerializer, IdentitySerializer, MESSAGE_RSOCKET_ROUTING, MESSAGE_RSOCKET_COMPOSITE_METADATA, CompositeMetadata, encodeRoute, decodeRoutes, encodeCompositeMetadata } from "rsocket-core"
import { Flowable } from 'rsocket-flowable';
// const {RSocketClient} = require('rsocket-core');
// const RSocketWebsocketClient = require('rsocket-websocket-client').default;
// const WebSocket = require("ws");
// const {Flowable} = require('rsocket-flowable');

var client = new RSocketClient({
  setup: {
    keepAlive: 50000,
    lifetime: 600000,
    dataMimeType: 'text/plain',
    metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string, //'message/x.rsocket.routing.v0'
  },
  transport: new RSocketWebSocketClient({
    url: 'ws://localhost:7500/rsocket',
  }, BufferEncoders),
});

class App extends Component {
  
//   constructor() {
//     super();
    // var client = new RSocketClient({
    //   setup: {
    //     keepAlive: 50000,
    //     lifetime: 600000,
    //     dataMimeType: 'text/plain',
    //     metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string, //'message/x.rsocket.routing.v0'
    //   },
    //   transport: new RSocketWebSocketClient({
    //     url: 'ws://localhost:7502/rsocket',
    //   }, BufferEncoders),
    // });

//     this.state={rsocketClient : client};
// }


  requestResponse() {
    this.state.rsocketClient.connect()
    .then(rsocket => {
      console.log("Connected to rsocket server");
      rsocket
        .requestResponse({
          data: Buffer.from("Clients Request - Using requestResponse"),
          metadata: encodeCompositeMetadata([
            [MESSAGE_RSOCKET_ROUTING, encodeRoute("newone")],
          ]),
        })
        .subscribe({
          onComplete: (response) => {
            console.log("Request Completed");
            console.log(response.data.toString());
          },
          onError: (error) => {
            console.log("Some Error occurred at server side");
            console.error(error);
          },
          onSubscribe: subscription => {
             //subscription.request(5);
          },
          onNext: (p) => {
            console.log("Received with love from server side : "+p.data);
          }
        })
      });
  }
  
  requestStream() {
    this.state.rsocketClient.connect()
    .then(rsocket => {
      console.log("Connected to rsocket server");
      rsocket
        .requestStream({
          data: Buffer.from("Clients Request - Using requestStream"),
          metadata: encodeCompositeMetadata([
            [MESSAGE_RSOCKET_ROUTING, encodeRoute("newonetwo")],
          ]),
        })
        .subscribe({
          onComplete: (response) => {
            console.log("Request Completed");
           // console.log(response.data.toString());
          },
          onError: (error) => {
            console.log("Some Error occurred at server side");
            console.error(error);
          },
          onSubscribe: subscription => {
            subscription.request(2147483647);
          },
          onNext: (p) => {
            console.log("Received with love from server side : "+p.data);
          }
        })
    });
  }


  requestStreamTwo() {
    this.state.rsocketClient.connect()
    .then(rsocket => {
      console.log("Connected to rsocket server");
      rsocket
        .requestStream({
          data: Buffer.from("Clients Request - Using requestStream"),
          metadata: encodeCompositeMetadata([
            [MESSAGE_RSOCKET_ROUTING, encodeRoute("newtwotwo")],
          ]),
        })
        .subscribe({
          onComplete: (response) => {
            console.log("Request Completed");
           // console.log(response.data.toString());
          },
          onError: (error) => {
            console.log("Some Error occurred at server side");
            console.error(error);
          },
          onSubscribe: subscription => {
            subscription.request(2147483647);
          },
          onNext: (p) => {
            console.log("Received with love from server side : "+p.data);
          }
        })
    });
  }

  myChannelFun() {

    this.state.rsocketClient.connect().subscribe({
      onComplete: (socket) => {
        console.log('Client connected to the RSocket server');
    
        let clientRequests = ['a', 'b', 'c'];
    
        clientRequests = clientRequests.map((req) => {
          return {
            data: req
          };
        });

        // const flowable = new Flowable((subscriber) => {
        //   console.log("flowing now");
        //   // lambda is not executed until `subscribe()` is called
        //   const values = [0, 1, 2, 3];
        //   subscriber.onSubscribe({
        //     cancel: () => {
        //       /* no-op */
        //     },
        //     request: (n) => {
        //       while (n--) {
        //         if (values.length) {
        //           const next = values.shift();
        //           // Can't publish values until request() is called
        //           subscriber.onNext(next);
        //         } else {
        //           subscriber.onComplete();
        //           break;
        //         }
        //       }
        //     },
        //   });
        // });
        
        const flownew = new Flowable();

    
        // let subscription;
    
        const stream = Flowable.just(...clientRequests);

        // //console.log(stream.onNext());
    
        socket.requestChannel({
          data: stream,
            metadata: encodeCompositeMetadata([
              [MESSAGE_RSOCKET_ROUTING, encodeRoute("newonechannel")],
            ]),
          }).subscribe({
            onSubscribe: subscription => {
              console.log("Subsribed")
              subscription.request(2147483647);
            },
          onNext: (response) => {
            console.log(`Client recieved: ${JSON.stringify(response)}`);
          },
          onError: error => {
                console.log("Error is here");
                console.log(error);
                //addErrorMessage("Connection has been refused due to ", error);
              
          },
          onComplete: () => {
            console.log(`Client received end of server stream`);
          },
        });
      }
    });

  }

  channelTest() {
    this.state.rsocketClient.connect().subscribe({
      onComplete: (socket) => {
        console.log('Client connected to the RSocket server');
    
        let clientRequests = ['a', 'b', 'c'];
    
        clientRequests = clientRequests.map((req) => {
          return {
            data: req
          };
        });
    
        let subscription;
    
        const stream = Flowable.just(...clientRequests);
    
        socket.requestChannel(stream).subscribe({
          onSubscribe: (sub) => {
            subscription = sub;
            console.log(`Client is establishing a channel`);
            subscription.request(0x7fffffff);
          },
          onNext: (response) => {
            console.log(`Client recieved: ${JSON.stringify(response)}`);
          },
          onComplete: () => {
            console.log(`Client received end of server stream`);
          }
        });
      }
    });
  }


  channelFinal() {
    client.connect().subscribe({
      onComplete: socket => {
        console.log('Client connected to the RSocket server');
        let subscription;
    
        const clientRequests = [Buffer.from("a"), Buffer.from("b")];

        const channel1Requests = clientRequests.map(req => {
          return {
            data: req,
            metadata: encodeCompositeMetadata([
              [MESSAGE_RSOCKET_ROUTING, encodeRoute("newonechannel_1")],
            ]),
          };
        });
        socket.requestChannel(Flowable.just(...channel1Requests))
        .subscribe({
          onSubscribe: sub => {
            subscription = sub;
            console.log(`Client is establishing Channel 1`);
            subscription.request(100000);
          },
          onNext: response => {
            console.log(`Channel 1: ${response.data}`);
          },
          onComplete: () => {
            console.log(`Channel 1 received end of server stream`);
          },
          onError: err => {
            console.error(err);
          }
        });
    
      }
    });
  }
  


  render() {
    {this.channelFinal()}
    // {this.requestStreamTwo()}
    return (
      <div className="App">
        <h1>Hello World!</h1>
      </div>
    );

  }
  
}

export default App;
