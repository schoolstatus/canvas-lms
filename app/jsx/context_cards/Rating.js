import React from 'react'
import I18n from 'i18n!student_context_tray'
import classnames from 'classnames'
import { Heading, Rating as InstUIRating, Typography } from 'instructure-ui'

  class Rating extends React.Component {
    static propTypes = {
      analytics: React.PropTypes.object,
      label: React.PropTypes.string,
      metricName: React.PropTypes.string
    }

    static defaultProps = {
      analytics: {}
    }

    get valueNow () {
      return this.props.analytics[this.props.metricName]
    }

    formatValueText (currentRating, maxRating) {
      const valueText = {}
      valueText[I18n.t('High')] = currentRating === maxRating
      valueText[I18n.t('Moderate')] = currentRating === 2
      valueText[I18n.t('Low')] = currentRating === 1
      valueText[I18n.t('None')] = currentRating === 0
      return classnames(valueText)
    }

    render () {
      if (typeof this.valueNow !== 'undefined') {
        return (
          <div
            className="StudentContextTray-Rating">
            <Heading level="h5" as="h4">
              {this.props.label}
            </Heading>
            <div className="StudentContextTray-Rating__Stars">
              <InstUIRating
                formatValueText={this.formatValueText}
                label={this.props.label}
                valueNow={this.valueNow}
                valueMax={3}
              />
              <div>
                <Typography size="small" color="brand">
                  {this.formatValueText(this.valueNow, 3)}
                </Typography>
              </div>
            </div>
          </div>
        )
      } else { return null }
    }
  }

export default Rating
