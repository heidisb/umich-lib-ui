import React from 'react';
import PropTypes from 'prop-types'
import Icon from '@umich-lib-ui/icon'
import {
  Expandable,
  ExpandableProvider,
  ExpandableChildren,
  ExpandableButton
} from '@umich-lib-ui/expandable'
import styled from 'react-emotion'
import {
  colors,
  intent_colors,
  MEDIA_QUERIES
} from '@umich-lib-ui/styles'

const FigureStyled = styled('figure')({
  overflowX: 'auto',
  overflowY: 'visible',
  margin: 0,
  padding: 0,
  'tr:not(:last-child)': {
    borderBottom: `solid 1px ${colors.grey[400]}`
  }
})

const FigCaptionStyled = styled('figcaption')({
  [MEDIA_QUERIES.LARGESCREEN]: {
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap'
  }
})

const FigCaptionContentStyled = styled('div')({

})

const NotesListStyled = styled('ul')({
  fontSize: '0.875rem',
  margin: 0,
  padding: 0,
  listStyle: 'none'
})

const StyledTH = styled('th')({
  fontSize: '0.875rem',
  color: colors.grey[600],
  borderBottom: `solid 2px ${colors.grey[400]}`
})

const td_and_th = {
  padding: '0.5rem 0',
  textAlign: 'left',
  '&:not(:last-child)': {
    paddingRight: '1rem'
  }
}

const TableStyled = styled('table')({
  borderCollapse: 'collapse',
  borderSpacing: '0',
  width: '100%',
  minWidth: '30rem',
  tableLayout: 'fixed',
  'tbody': {
    'tr:not(:last-child)': {
      borderBottom: `solid 1px ${colors.grey[400]}`
    }
  },
  'td': td_and_th,
  'th': td_and_th
})

const Cell = ({
  cell,
  renderAnchor
}) => {
  return (
    <React.Fragment>
      {cell.icon && (<Icon icon={cell.icon} style={{ marginRight: '0.25rem' }} />)}

      {(() => {
        if (cell.href) {
          return (<a href={cell.href}>{cell.text}</a>)
        }
        if (cell.to) {
          return (renderAnchor(cell))
        }
        if (cell.html) {
          return <span dangerouslySetInnerHTML={{ __html: cell.html }} />
        }
        return (<React.Fragment>{cell.text}</React.Fragment>)
      })()}
    </React.Fragment>
  )
}

/**
  Use this component to provide a comprehensive listing of options to access a resource.
*/
class ResourceAccess extends React.Component {
  constructor(props) {
    super(props)
    this.captionId = 'caption-' + Math.random().toString(36).substr(2, 9);
    this.summaryId = 'summary-' + Math.random().toString(36).substr(2, 9);
  }

  render() {
    const {
      caption,
      notes,
      captionLink,
      headings,
      rows,
      name,
      renderAnchor
    } = this.props

    return (
      <FigureStyled>
        <Expandable>
          <FigCaptionStyled>
            {caption && (
              <FigCaptionContentStyled className="x-spacing">
                <span style={{ fontWeight: '600' }}>{caption}</span>
                {captionLink && (
                  <a href={captionLink.href} style={{
                    fontSize: '0.875rem'
                  }}>{captionLink.text}</a>
                )}
                {notes && (
                  <NotesListStyled>
                    {notes.map((note, n) => <li key={n}>{note}</li>)}
                  </NotesListStyled>
                )}
              </FigCaptionContentStyled>
            )}
          </FigCaptionStyled>
          <TableStyled>
            <thead>
              <tr>
                {headings.map((heading, i) => (
                  <StyledTH scope="col" key={i}>{heading}</StyledTH>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {rows[0].map((cell, t) => (
                  <td key={t} style={{ color: `${intent_colors[cell.intent]}`}}>
                    <Cell cell={cell} renderAnchor={renderAnchor} />
                  </td>
                ))}
              </tr>
              {rows.length > 6 && (
                <tr>
                  <td colSpan={`${headings.length}`}>
                    <ExpandableButton kind="secondary" small count={rows.length} name={name} />
                  </td>
                </tr>
              )}
              <ExpandableChildren show={0}>
                {rows.slice(1).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, t) => (
                      <td key={t} style={{ color: `${intent_colors[cell.intent]}`}}>
                        <Cell cell={cell} renderAnchor={renderAnchor} />
                      </td>
                    ))}
                  </tr>
                ))}
              </ExpandableChildren>
              <ExpandableProvider>
                {context =>
                  <React.Fragment>
                    {rows.length > 1 && (context.expanded || rows.length <= 6) ? (
                      <tr>
                        <td colSpan={`${headings.length}`}>
                          <ExpandableButton kind="secondary" small count={rows.length} name={name} />
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                }
              </ExpandableProvider>
            </tbody>
          </TableStyled>
        </Expandable>
      </FigureStyled>
    )
  }
}

ResourceAccess.propTypes = {
  /**
    Table column headings.
  */
  headings: PropTypes.array.isRequired,
  /**
    Table rows must be an array of arrays. Each inner array represent a row and will contain objects for each cell. A cell object must contain a text key with a string value. If you wish the cell to be linked somewhere then include `to` or an `href` key. See `renderAnchor` prop to decide between `to` or `href`.
  */
  rows: PropTypes.array.isRequired,
  /**
    Name used to show all rows.
  */
  name: PropTypes.string,
  /**
    The displayed table caption. If you do not use this prop, make sure the preceding heading is appropriate.
  */
  caption: PropTypes.string,
  /**
    Link to more information about the table caption.
  */
  captionLink: PropTypes.shape({
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired
  }),
  /**
    Notes necessary to understand the resource access options.
  */
  notes: PropTypes.array,
  /** Row cells that use key 'to' instead of 'href' will use this render prop. This is useful if you want to use a routing library such as React Router instead of an HTML anchor. */
  renderAnchor: PropTypes.func
};

export default ResourceAccess