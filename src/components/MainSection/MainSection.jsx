import React from 'react'
import SuggestionBox from '../SuggestionsBox/SuggestionBox'
import LinksBox from '../LinksBox/LinksBox'
import CreateBox from '../CreateBox/CreateBox'
import PostsBox from '../PostsBox/PostsBox'
import Tags from '../Tags/Tags'
import LogoBox from '../LogoBox/LogoBox'
import Cover from "../../assets/voilk.png"
import MetaTags from 'react-meta-tags';
import { useParams } from 'react-router-dom'

function MainSection(props) {
    
    const { type } = useParams()

    return (
        <>
        <MetaTags>
    <title>{type} - Voilk</title>
            <meta name="description" content={`All ${type} Posts`} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Voilk" />
            <meta property="og:title" content={type} />
            <meta property="og:image" content={Cover} />
            <meta property="og:description" content={`Read all ${type} posts on voilk`} />
            <meta property="fb:app_id" content="588295505354973" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content={`@voilk`} data-reactid="14"></meta>
            <meta name="twitter:title" content={`All ${type} Posts #voilk`} data-reactid="15"></meta>
            <meta name="twitter:image" content= {Cover} data-reactid="16"></meta>
        
        </MetaTags>
        <section class="banner">
                
                <span class="banner-title"><i class="fa fa-edit"></i> {type} posts!!</span>
            </section>
        <main>
                    <div class="main-section">
                        <div class="container">
                            <div class="main-section-data">
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 pd-left-none no-pd">
                                        <div class="main-left-sidebar no-margin">
                                        <Tags type={type}/>
                                        <SuggestionBox />
                                        
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-8 no-pd">
                                        <div class="main-ws-sec">
                                            <CreateBox />
                                            <PostsBox />
                                        </div>
                                    </div>
                                    <div class="col-lg-3 pd-right-none no-pd">
                                        <div class="right-sidebar">
                                            <LogoBox />
                                            <SuggestionBox />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                    <LinksBox />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
    
    </>)
}

export default MainSection
