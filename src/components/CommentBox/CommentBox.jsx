import React from 'react'

function CommentBox() {
    return (
        <div class="post-popup comment-post">
            <div class="post-project">
                <h3>Post a Comment</h3>
                <div class="post-project-fields">
                    <form>
                        <div class="row">

                            <div class="col-lg-12">
                                <textarea name="description" placeholder="Type your comment here.."></textarea>
                            </div>
                            <div class="col-lg-12">
                                <ul>
                                    <li><button class="active" type="submit" value="post">Post</button></li>
                                    <li><a href="#" title="">Cancel</a></li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
                <a href="#" title=""><i class="la la-times-circle-o"></i></a>
            </div>
        </div>

    )
}

export default CommentBox
