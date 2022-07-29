# Datatable Usage

## Parameters

| Params  | Type    | Description                                                          |
| :------ | ------- | :------------------------------------------------------------------- |
| columns | Array   | List of Datatable Column see **Datatable Column**                    |
| order   | Object  | Object column and direction _{column, dir}_. see **Datatable Order** |
| page    | Integer | Number of Page                                                       |
| perPage | Integer | Number of Per page                                                   |
| search  | Object  | Search Value see **Datatable Search**                                |
| filter  | Array   | List of Datatable Filter see **Datatable Filter**                    |

### Datatable Column

| Params     | Type    | Description    |
| :--------- | :------ | :------------- |
| data       | String  | Name of column |
| searchable | Boolean | Is Searchable  |
| sortable   | Boolean | Is Orderable   |

### Datatable Order

| Params | Type   | Description                   |
| :----- | :----- | :---------------------------- |
| column | String | Name of column                |
| dir    | String | Order Direction _Asc \| Desc_ |

### Datatable Search

| Params | Type   | Description  |
| :----- | :----- | :----------- |
| value  | String | Search Value |

### Datatable Filter

| Params   | Type    | Description                                       |
| :------- | :------ | :------------------------------------------------ |
| column   | String  | Name of column                                    |
| value    | String  | Filter Value                                      |
| operator | String  | Default "eq" see Sequalize Operator Documentation |
| isDate   | Boolean | Is date filter or not                             |

### Example

Request Method shoule be **POST**

Example Request:

```json
{
  "columns": [
    { "data": "slug", "searchable": true, "sortable": true },
    { "data": "name", "searchable": true, "sortable": true }
  ],
  "order": { "column": "name", "dir": "asc" },
  "page": 1,
  "perPage": 2,
  "search": { "value": "Budi" },
  "filter": [
    {
      "column": "name",
      "value": "budi",
      "operator": "iLike"
    }
  ]
}
```

Example Response:

```json
{
  "recordsFiltered": 2,
  "recordsTotal": 4,
  "data": [
    {
      "slug": "create",
      "name": "Create"
    },
    {
      "slug": "update",
      "name": "Update"
    }
  ]
}
```
