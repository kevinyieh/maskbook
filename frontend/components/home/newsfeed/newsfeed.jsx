import React from "react";
import PostItemContainer from "../../post/post_item_container";
import CreatPostFormContainer from "../../modal/post/post_form_container";

export default class Newsfeed extends React.Component{
    constructor(props){
        super(props)
        this.renderPostItem = this.renderPostItem.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.fetchAllUsers = this.fetchAllUsers.bind(this);
    }
    allUserIdsFromComments(posts){
        let allUsers = {};
        posts.forEach( (post) => {
            allUsers[post.userId] = true;
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
    fetchAllUsers(){
        this.props.fetchUsers(this.allUserIdsFromComments(this.props.posts))
    }
    componentDidMount(){
        this.props.fetchNewsfeed().then(this.fetchAllUsers);
    }
    renderPostItem(post){
        if(this.props.users[post.userId] && this.props.users[post.wallId]){
            return (<PostItemContainer 
                key={post.id} 
                post={post} 
                poster={{
                            id: post.userId,
                            fullName: `${this.props.users[post.userId].firstName} ${this.props.users[post.userId].lastName}`
                        }}
                postee={{
                    id: post.wallId,
                    fullName: `${this.props.users[post.wallId].firstName} ${this.props.users[post.wallId].lastName}`
                }}
                />
            )
        }
        return null;
    }

    handleOpenModal(e){
        e.preventDefault();
        this.props.openModal({type: "create-post", post: ""});
    }

    render(){
        if(Object.values(this.props.users).length < 1) return null;
        const pfp = this.props.currentUser.pfp ? this.props.currentUser.pfp : window.defaultPfp;
        return(
            <div className="newsfeed">
                <CreatPostFormContainer 
                    wallId={this.props.currentUser.id}
                />
                <div className="open-post-form-container">
                    <div className="open-post-form-main">
                        <div className="profile-pic-icon">
                            <img src={pfp}/>
                        </div>
                        <div onClick={this.handleOpenModal} className="open-post-form">
                            <p>{`What's on your mind, ${this.props.currentUser.firstName}?`}</p>
                        </div>
                    </div>
                </div>
                {this.props.posts.map(this.renderPostItem)}
            </div>
        )
    }
}