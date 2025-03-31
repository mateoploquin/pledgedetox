cd pledge-app
## Prerequisites

You need to use at least `nvm` > 18:
```sh
nvm use 18
```

## Run the App in the Simulator

To run the app in the simulator, use:
```sh
npx expo run:[ios or android]
```

## Export to Transporter for TestFlight

To export it to Transporter and get it on TestFlight, you need to use `EAS`:
```sh
eas build --platform [ios or android] --profile development
```