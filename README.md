# Open Badges

Service pour créer des Open Badges

## Développement

```
$ make start
```

Application disponible sur `http://localhost:8080`

## Choix technologique

### Frontend

Utilisation de [React](https://reactjs.org/) et de la librairie [fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch)

### Backend

Utilisation de la librairie [Yion](https://kevinbalicot.github.io/yion/)

### Base de donées

Utilisation de la base de données clé / valeur [NeDB](https://github.com/louischatriot/nedb)

## Divers

Pour changer le `host` du site, utiliser la variable d'environnement `HOST_ENV` (défaut : http://localhost).

Pour changer l'url de LDAP, utiliser la varible d'environnement `LDAP_URL_ENV` (défaut : ldap://10.0.0.19:389).
