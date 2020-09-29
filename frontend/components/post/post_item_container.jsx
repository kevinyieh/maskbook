import { connect } from "react-redux";
import PostItem from "./post_item";
import { openModal } from "../../actions/modal_actions";
import { deletePost } from "../../actions/post_actions";
import { createComment } from "../../actions/comment_actions";
import { fetchUser } from "../../actions/user_actions";

const mSTP = (state,ownProps) => {
    return {
        currentUser: state.session,
        post: ownProps.post,
        poster: Object.assign(state.entities.users[ownProps.poster.id], ownProps.poster),
        postee: ownProps.postee,
        users: state.entities.users
    }   
}

const mDTP = dispatch => {
    return {
        openModal: (modal) => dispatch(openModal(modal)),
        deletePost: (id) => dispatch(deletePost(id)),
        createComment: (comment) => dispatch(createComment(comment)),
    }
}

export default connect(mSTP,mDTP)(PostItem);