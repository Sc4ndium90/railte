# railte
Application that retrieve train journeys for a certain line with their disruptions with SNCF API


## Requirements

- MySQL Server 
- Node.JS


## Installation

One table required:

```sql
create table journeys
(
    id                varchar(512)                 not null
        primary key,
    disruption_id     text                         null,
    severity_effect   varchar(64)                  null,
    message           text                         null,
    disruption_status varchar(32)                  null,
    journey           longtext collate utf8mb4_bin null
        check (json_valid(`journey`))
)
    engine = InnoDB;
```


Well, for the moment this application is still in development and I don't recommand using it atm :c
