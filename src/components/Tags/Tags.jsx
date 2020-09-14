import React, { useState } from 'react'
import { useQuery} from "@apollo/react-hooks";
import { TAGS } from "../../queries/TAGS";
import Loading from '../Loading/Loading';
function Tags({type}) {


	const [selectedValue, setSelectedValue] = useState("")

	const { loading, error, data } = useQuery(TAGS, {
		variables: { limit: 50 },
	});

	let t = type.toLowerCase();
	if(!(t=="trending"
	||t=="active"
	||t=="cashout"
	||t=="created"
	||t=="voted"
	||t=="payout"
	||t=="commented"
	||t=="popular"
	||t=="children"
	)){
		t="trending"
	}

	if (loading) return (<div class="suggestions full-width">
	<div class="sd-title">
		<h3><i class="fas fa-tags"></i> All Tags</h3>
	</div>
	<div class="suggestions-list">
	<div class="sgt-text">
		<Loading size={2}/>
		</div>
		</div>
		</div>);
	if (error) return `Error! ${error}`;
	//console.log(data)
	return (
		<>
		<div class="suggestions full-width d-lg-none d-md-none">
		<div class="sd-title">
				<h3><i class="fas fa-tags"></i> All {type} Tags</h3>
			</div>
		<form class="suggestions-list" onSubmit={(e) => {
			e.preventDefault()
			
		}}>
			<div class="form-group">
				<select value={selectedValue} class="form-control select-style" onChange={(e) => {
					setSelectedValue(e.target.value)
					window.location.href = `/${type}/${e.target.value}`
				}}>
				{data.get_tags.map((tag, index) => {
					return(<option key={index} value={tag.name}>{tag.name == "" ? "All Tags" : tag.name}
					
					({tag.top_posts})</option>)
				})}
				</select>
			</div>
	  	</form>
		</div>

		<div class="suggestions full-width d-none d-lg-block d-md-block">
			<div class="sd-title">
				<h3><i class="fas fa-tags"></i> All {type} Tags</h3>
			</div>
			<div class="suggestions-list">
				{data.get_tags.map((tag, index) => {
					return (
						<div class="sgt-text" key={index}>
							<a href={`/${type}/${tag.name}`}><h4>{tag.name == "" ? "All Tags" : tag.name} <span class="text text-info">
									<i class="fas fa-newspaper"></i> 
									{" "+ tag.top_posts} | 
									<i class="fas fa-heart"></i> 
					{tag.net_votes} {tag.name != ""?"|":null} 
					{tag.name != ""?<a href={"/chat/"+tag.name}><i class="far fa-comment"></i>Chat</a>:null}
								</span></h4>
								
							</a>
						</div>
					)
				})}
				<div class="view-more">
					<a href="#" title="">View More</a>
				</div>
			</div>
		</div>
		</>
	)
}

export default Tags
