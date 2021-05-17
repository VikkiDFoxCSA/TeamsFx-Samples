﻿// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import Resources from "./constants/resources";
import * as microsoftTeams from "@microsoft/teams-js";
import { Provider, themes } from "@fluentui/react-northstar";
import DiscoverWrapperPage from "./components/card-view/discover-wrapper-page";
import ErrorPage from "./components/error-page";

import "./styles/site.css";
import "./i18n";
import { HashRouter as Router, Route } from "react-router-dom";
import { Suspense } from "react";

export interface IAppState {
    theme: string;
}

export default class App extends React.Component<{}, IAppState> {
    theme?: string | null;

    constructor(props: any) {
        super(props);
        let search = window.location.search;
        let params = new URLSearchParams(search);
        this.theme = params.get("theme");

        this.state = {
            theme: this.theme ? this.theme : Resources.default,
        }
    }

    componentDidMount() {
        microsoftTeams.initialize();

        microsoftTeams.registerOnThemeChangeHandler((theme: string) => {
            this.setState({ theme: theme! }, () => {
                this.forceUpdate();
            });
        });
    }

    public setThemeComponent = () => {
        if (this.state.theme === Resources.dark) {
            return (
                <Provider theme={themes.teamsDark}>
                    <div className="dark-container">
                        {this.getAppDom()}
                    </div>
                </Provider>
            );
        }
        else if (this.state.theme === Resources.contrast) {
            return (
                <Provider theme={themes.teamsHighContrast}>
                    <div className="high-contrast-container">
                        {this.getAppDom()}
                    </div>
                </Provider>
            );
        } else {
            return (
                <Provider theme={themes.teams}>
                    <div className="default-container">
                        {this.getAppDom()}
                    </div>
                </Provider>
            );
        }
    }

    public getAppDom = () => {
        return (
            <div className="appContainer">
                <Suspense fallback={<div className="container-div"><div className="container-subdiv"></div></div>}>
                    <Router>
                        <Route exact path="/" component={DiscoverWrapperPage} />
                        <Route exact path="/tab" component={DiscoverWrapperPage} />
                        <Route exact path="/discover" component={DiscoverWrapperPage} />
                        <Route exact path="/errorpage" component={ErrorPage} />
                </Router>
               </Suspense>
            </div>);
    }

	/**
	* Renders the component
	*/
    public render(): JSX.Element {
        return (
            <div>
                {this.setThemeComponent()}
            </div>
        );
    }
}