# Pobranie listy zdjęć z geotagami

Zwraca liste wszystkich przeslanych zdjęc z geotagami.

**URL** : `/api/geotag/`

**Method** : `GET`

## Success Response

**Content example**

```json
[
  {
    "id": "number",
    "file_name": "string",
    "src": "string" // link do miniaturki na serwerze
  }
]
```
**Data example** 

```json
{
    "id": 1,
    "file_name": "photo.png",
    "src": "http://localhost:90/images/photo.png"
}
```

# Dodanie nowego zdjęcia z geotagiem.

Dodaje i zapisuje na serwerze nowe zdjęcie. W odpowiedzi identyfikator nowego zdjęcia.

**URL** : `/api/geotag/`

**Method** : `POST`

**Data example**

```json
{
    "file_name": "string", //nazwa pliku - nie wiem czy to się zakoduje w tym polu poniżej
    "base_64": "string", //tresc pliku zakodowana w base64
    "latitude": "number",
    "longitude": "number"
}
```

## Success Response

**Content example**

```json
1 // id nowo dodanego zdjęcia
```

# Udpate współrzędnych zdjęcia o podanym ID

Aktualizuje współrzędne geotagu dla zdjęcia o podanym ID.

//Jak wam będzie wygodniej to te id możemy do tego jsona wsadzić

**URL** : `/api/geotag/{id_zdjecia}`

**Method** : `PATCH`

**Data example**

```json
{
    "latitude": "number",
    "longitude": "number"
}
```

## Success Response

**Code** : `200 OK`

# Usunięcie zdjęcia o podanym ID

Usuwa zdjęcia o podanym ID


**URL** : `/api/geotag/{id_zdjecia}`

**Method** : `DELETE`

## Success Response

**Code** : `200 OK`

# Pobieranie zdjęć

Zwraca w body zakodowaną w base_64 treść obrazka o podanym id


**URL** : `/api/dowloads/{id_zdjecia}`

**Method** : `GET`

## Success Response
W body zakodowany content obrazka 

**Code** : `200 OK`


