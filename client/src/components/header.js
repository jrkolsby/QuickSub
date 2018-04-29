import React, {Component} from 'react' 

class Header extends Component {
    render() {
        return (
            <header>
                <div id="title">QuickSub</div>
                <div className="toolbar">
                    <span className="left">
                        <span 
                            className={this.props.isUploading ? 
                                        "icon upload" :
                                        "icon upload active"}
                            onClick={this.props.handleUpload}
                        >Upload Video</span>
                        <span className="icon download active">Paste Link</span>
                    </span>

                    <span className="right">
                        <span className={this.props.error ? 
                                        "notification error" :
                                        "notification"}
                        >
                            {this.props.error ? this.props.errorText : null}
                        </span>
                        <span 
                            className={this.props.isUploading ? 
                                        "icon captions" :
                                        "icon captions active"}
                            onClick={() => {
                                if (!this.props.isUploading)
                                    this.props.handleExport
                            }}
                        >Download Captions</span>
                    </span>
                </div>
            </header>
        )
    }
}

export default Header
