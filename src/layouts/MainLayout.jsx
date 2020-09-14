import React, { Component } from 'react'
import ChatBox from '../components/ChatBox/ChatBox'
import ProjectBox from '../components/ProjectBox/ProjectBox'
import Header from '../components/Header/Header'
import MainSection from '../components/MainSection/MainSection'
import CommentBox from '../components/CommentBox/CommentBox'
import { Route, Switch, Redirect } from "react-router-dom";
import dashboardRoutes from "../routes/mainroutes";

export class MainLayout extends Component {
    render() {
        return (
            <div class="wrapper">
                <Header />
                <Switch>
            {dashboardRoutes.map((prop, key) => {
              if (prop.collapse) {
                return prop.views.map((prop2, key2) => {
                  return (
                    <Route
                      path={prop2.path}
                      component={prop2.component}
                      key={key2}
                    />
                  );
                });
              }
              if (prop.redirect)
                return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
              if (prop.dynamic)
                return (
                  <Route
                    path={prop.path}
                    component={prop.component}
                    key={key}
                  />
                );
              return (
                <Route path={prop.path} component={prop.component} key={key} />
              );
            })}
          </Switch>
                <ProjectBox />
                <CommentBox/>
                
            </div>
        )
    }
}

export default MainLayout
