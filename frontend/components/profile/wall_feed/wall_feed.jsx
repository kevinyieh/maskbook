import React from "react";
import PostItemContainer from "../../post/post_item_container";
import CreatPostFormContainer from "../../modal/post/post_form_container";
import Loading from "../../ui/loading";
import { Link } from "react-router-dom";

export default class WallFeed extends React.Component{
    constructor(props){
        super(props)
        this.renderPostItem = this.renderPostItem.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.state = {
            loading: true
        };
    }
    allUserIdsFromComments(posts){
        let allUsers = {};
        posts.forEach( (post) => {
            allUsers[post.userId] = true;
            allUsers[post.wallId] = true;
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
        this.props.fetchWallFeed(this.props.user.id).then(() => {
            this.props.fetchUsers(this.allUserIdsFromComments(this.props.posts)).then( () => {
                this.setState({
                    loading: false
                })
            })
        });
    }
    componentDidUpdate(prevProps){
        if(prevProps.user.id !== this.props.user.id){
            this.setState({
                loading: true
            });
            this.props.fetchWallFeed(this.props.user.id).then(() => {
                this.props.fetchUsers(this.allUserIdsFromComments(this.props.posts)).then( () => {
                    this.setState({
                        loading: false
                    })
                })
            });
        }
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

    renderInputPlaceholder(){
        if(this.props.user.id === this.props.currentUser.id){
            return <p>{`What's on your mind, ${this.props.currentUser.firstName}?`}</p>
        }else{
            return <p>{`Write something to ${this.props.user.firstName}... `}</p>
        }
    }

    render(){
        if(Object.values(this.props.users).length < 1) return null;
        if(this.state.loading) return <div className="wallfeed"><Loading /></div>;
        const pfp = this.props.currentUser.pfp ? this.props.currentUser.pfp : window.defaultPfp;
        return(
            <div className="wallfeed">
                <CreatPostFormContainer 
                    wallId={this.props.user.id}
                />
                <div className="open-post-form-container">
                    <div className="open-post-form-main">
                        <Link to={`/users/${this.props.currentUser.id}`}>
                            <div className="profile-pic-icon">
                                <img src={pfp}/>
                            </div>
                        </Link>
                        <div onClick={this.handleOpenModal} className="open-post-form">
                            {this.renderInputPlaceholder()}
                        </div>
                    </div>
                </div>
                {this.props.posts.map(this.renderPostItem)}
            </div>
        )
    }
}