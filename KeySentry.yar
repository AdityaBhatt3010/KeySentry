rule KeySentry
{
    meta:
        author = "Aditya Bhatt"
        description = "Detect common API keys, secrets, credentials, and sensitive filenames"
        date = "2026-05-30"

    strings:
        // API Keys
        $aws         = /AKIA[0-9A-Z]{16}/
        $google      = /AIza[0-9A-Za-z\-_]{35}/
        $slack       = /xox[baprs]-[0-9a-zA-Z]{10,48}/
        $stripe      = /sk_live_[0-9a-zA-Z]{24}/
        $sendgrid    = /SG\.[A-Za-z0-9\-_]{22}\.[A-Za-z0-9\-_]{43}/
        $twilio      = /SK[0-9a-fA-F]{32}/
        $github      = /gh[pousr]_[A-Za-z0-9_]{36,255}/
        $openai      = /sk-[A-Za-z0-9]{48}/
        $heroku      = /[Hh]eroku[a-z0-9]{32}/
        $mailgun     = /key-[0-9A-Za-z]{32}/
        $firebase    = /AAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140}/
        $digitalocean = /dop_v1_[a-f0-9]{64}/
        $cloudflare  = /cf-[a-z0-9]{32}/
        $jwt         = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/
        $rsa_key     = "-----BEGIN RSA PRIVATE KEY-----"
        $facebook    = /EAACEdEose0cBA[0-9A-Za-z]+/
        $azure       = /DefaultEndpointsProtocol=https;AccountName=[a-z0-9]+;AccountKey=[A-Za-z0-9+\/=]+/
        $dropbox     = /sl\.[A-Za-z0-9\-_]{20,}/
        $notion      = /secret_[A-Za-z0-9]{43}/
        $terraform   = /tfr_[A-Za-z0-9]{32}/
        $circleci    = /circle-token [a-f0-9]{40}/
        $basicauth   = /https?:\/\/[A-Za-z0-9_-]+:[A-Za-z0-9_-]+@/

        // Sensitive filenames
        $env1        = ".env"
        $env2        = ".env.local"
        $env3        = ".env.production"
        $env4        = ".env.dev"
        $env5        = ".env.test"
        $credjson    = "credentials.json"
        $firebasejson= "firebase.json"
        $awscred     = ".aws/credentials"
        $npmrc       = ".npmrc"
        $dockercfg   = ".dockercfg"
        $idrsa       = "id_rsa"
        $idrsapub    = "id_rsa.pub"
        $pypirc      = ".pypirc"

    condition:
        any of them
}
