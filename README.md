# competition

## Personalize Dataset Schema

### title

```json
{
    "type": "record",
    "name": "Items",
    "namespace": "com.amazonaws.personalize.schema",
    "fields": [
        {
            "name": "ITEM_ID",
            "type": "string"
        },
        {
            "name": "CREATION_TIMESTAMP",
            "type": "long"
        },
        {
            "name": "TITLE",
            "type": "string",
            "categorical": true
        }
    ],
    "version": "1.0"
}
```

### user

```json
```

### title read

```json
{
    "type": "record",
    "name": "Interactions",
    "namespace": "com.amazonaws.personalize.schema",
    "fields": [
        {
            "name": "USER_ID",
            "type": "string"
        },
        {
            "name": "ITEM_ID",
            "type": "string"
        },
        {
            "name": "TIMESTAMP",
            "type": "long"
        },
        {
            "name": "TITLE",
            "type": "string",
            "categorical": true
        },
        {
            "name": "EVENT_TYPE",
            "type": "string"
        }
    ],
    "version": "1.0"
}
```
