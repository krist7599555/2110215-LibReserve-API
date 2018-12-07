# 2110215 LibReserve API

This repo is API backend for 2110215 ProgMeth project (Engineer, Chula 101). using Java(Javafx) for UI and javascript mongoDB for backend

## endpoint

http://218.199.216.159:3721

## API

### structure

```
[[ Data ]] = {
  username:  { type: String, required: true },
  startTime: { type: Number, required: true },
  endTime:   { type: Number, required: true },
  position:  { type: String, required: true }
}

* Time value = Time / 60 Hour + Time % 60 Minute
  eg. 510
    = 510 mn
    = 8 * 60 mn + 30 mn
    = 8 hr + 30 mn
    = 8:30
```

#### GET /table

get full table from BigGroup (eg. A, B, C) and SmallGroup (eg. A1, A2, B1)

```
# A = A1 ∪ A2 ∪ A3 ∪ A4 ...
{
  A:  [Data, Data, ...],
  A1: [Data, Data, ...],
  A2: [Data, Data, ...],
  A3: [Data, Data, ...],
  B:  [Data, Data, ...],
  B1: [Data, Data, ...],
  B2: [Data, Data, ...],
  B3: [Data, Data, ...],
  ...
}
```

#### GET /table/:pos

get datas in specific position accept BigGroup and SmallGroup

```
/table/A1 = [Data, Data, ...]
/table/A  = A1 + A2 + A3 + A4 + ...
```

#### GET /add

add data on query string to database.

```
* require field
/add
  ? username=*
  & startTime=*
  & endTime=*
  & position=*

eg. GET /add?username=MrRock&startTime=510&endTime=600&position=A13
```

#### GET /remove

remove all data that match given parameter

```
/remove
  ? username=
  & startTime=
  & endTime=
  & position=

eg. GET /remove?position=A13
eg. GET /remove?username=MrRock&endTime=600
```

#### GET /history/:username

return all data which Data.username = username

```
/history/:username = [Data, Data, Data, ...]
```
