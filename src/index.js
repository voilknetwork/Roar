import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import { ApolloProvider } from "@apollo/react-hooks";
import {InMemoryCache} from "apollo-cache-inmemory";
import ApolloClient from "apollo-boost";

import indexRoute from "./routes/indexroutes.jsx";
import {
  LoginProviderComponent,
  UserProviderComponent,
  SocketProviderComponent
} from "./contexts"

const cache = new InMemoryCache();


const hist = createBrowserHistory();
const client = new ApolloClient({
  uri: "https://graphql.voilk.com/graphql",
  cache
});



ReactDOM.render(
  <React.StrictMode>
  <ApolloProvider client={client}>
    <LoginProviderComponent>
      <UserProviderComponent>
        <SocketProviderComponent>
      <Router history={hist}>
        <Switch>
          {indexRoute.map((prop, key) => {
            return (
              <Route path={prop.path} key={key} component={prop.component} />
            );
          })}
        </Switch>
      </Router>
      </SocketProviderComponent>
      </UserProviderComponent>
    </LoginProviderComponent>
  </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

