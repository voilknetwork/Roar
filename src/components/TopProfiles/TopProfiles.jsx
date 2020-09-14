import React, {useEffect, useState} from 'react'
import UProfile from './UProfile'
import $ from "jquery"
import { useQuery } from 'react-apollo'
import { GET_USERS } from '../../queries/GET_USERS'
require("slick-carousel")

function TopProfiles() {

    const [r_users, setR_users] = useState([])
    const { loading, error, data, refetch } = useQuery(GET_USERS, {
        variables: {lowerBound: "", limit: 50}
    });
    const [isOn, setIsOn] = useState(true)
    useEffect(() => {
        if(!loading&&r_users.length<7){
            let users = data.lookup_accounts
            //console.log(users)
            for (let i = 0; i < 7; i++) {
                const element = Math.floor(Math.random() * 50);
                
                setR_users([...r_users, users[element]])
            }
            
            
        }
        if(r_users.length>=7&&isOn){
            $('.profiles-slider').slick({
                slidesToShow: 3,
                slck:true,
                slidesToScroll: 1,
                prevArrow:'<span class="slick-previous"></span>',
                nextArrow:'<span class="slick-nexti"></span>',
                autoplay: true,
                dots: false,
                autoplaySpeed: 2000,
                responsive: [
                {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
                },
                {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
                },
                {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
                }
                // You can unslick at a given breakpoint now by adding:
                // settings: "unslick"
                // instead of a settings object
            ]
            })
            setIsOn(false)
        }

    }, [data, r_users])

    if (loading||r_users.length<1) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    return (
        <div class="top-profiles">
            <div class="pf-hd">
                <h3>Suggestions</h3>
                <i class="la la-ellipsis-v"></i>
            </div>
            <div class="profiles-slider">
                {r_users.map((usr,i) => {
                    //console.log(usr)
                    return(<UProfile usr={usr} key={i} refetch={refetch}/>)
                })}
            </div>
        </div>

    )
}

export default TopProfiles
