import I18n from 'i18n!external_tools'
import React from 'react'
import htmlEscape from 'str/htmlEscape'

export default React.createClass({
    displayName: 'Lti2Permissions',

    propTypes: {
      tool: React.PropTypes.object.isRequired,
      handleCancelLti2: React.PropTypes.func.isRequired,
      handleActivateLti2: React.PropTypes.func.isRequired
    },

    render() {
      var p1 = I18n.t(
        '*name* has been successfully installed but has not yet been enabled.',
        { wrappers: [
          '<strong>' + htmlEscape(this.props.tool.name) + '</strong>'
        ]}
      );
      return (
        <div className="Lti2Permissions">
          <div className="ReactModal__Body">
            <p dangerouslySetInnerHTML={{ __html: p1 }}></p>
            <p>{I18n.t('Would you like to enable this app?')}</p>
          </div>
          <div className="ReactModal__Footer">
            <div className="ReactModal__Footer-Actions">
              <button type="button" className="Button" onClick={this.props.handleCancelLti2}>{I18n.t("Delete")}</button>
              <button type="button" className="Button Button--primary" onClick={this.props.handleActivateLti2}>{I18n.t('Enable')}</button>
            </div>
          </div>
        </div>
      )
    }
  });
