// import { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    width: 300,
    height: 422,
    borderRadius: 10,
    backgroundColor: 'white',
    color: 'blue',
    flexDirection: 'column',
    justifyContent: 'center',
  },
})

const PlayingCard = ({ card, chips }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography className={classes.value} variant="h2" component="h2">
        {card}
      </Typography>
      <Typography className={classes.value} variant="h2" component="h2">
        {'⚫'.repeat(chips)}
      </Typography>
    </div>
  )
}

export default PlayingCard
