import React from "react";
import PostItem from "../../post/post_item";

export default class Newsfeed extends React.Component{
    constructor(props){
        super(props)
        this.renderPostItem = this.renderPostItem.bind(this);
    }
    allUserIdsFromComments(posts){
        let allUsers = {};
        posts.forEach( (post) => {
            if(post.comments){
                Object.values(post.comments).forEach( (comment) => {
                    if(comment.subComments){
                        Object.values(comment.subComments).forEach( (subComment) => {
                            allUsers[subComment.userId] = true;
                        })
                    }
                    allUsers[comment.userId] = true;
                })
            }
        })
        return Object.keys(allUsers);
    }
    componentDidMount(){
        this.props.fetchNewsfeed().then(() => {
            this.props.fetchUsers(this.allUserIdsFromComments(this.props.posts))
        });
    }
    renderPostItem(post){
        if(this.props.users[post.userId] && this.props.users[post.wallId]){
            return (<PostItem key={post.id} 
                post={post} 
                poster={{
                            id: post.userId,
                            fullName: `${this.props.users[post.userId].firstName} ${this.props.users[post.userId].lastName}`
                        }}
                postee={{
                    id: post.wallId,
                    fullName: `${this.props.users[post.wallId].firstName} ${this.props.users[post.wallId].lastName}`
                }}/>
            )
        }
        return null;
    }
    render(){
        if(Object.values(this.props.users).length < 1) return null;
        return(
            <div className="newsfeed">
                {this.props.posts.map(this.renderPostItem)}
            </div>
        )
    }
}