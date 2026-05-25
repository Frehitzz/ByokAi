<?php

test('project defaults target mysql instead of sqlite', function () {
    $projectRoot = dirname(__DIR__, 2);
    $environmentFiles = ['.env', '.env.example'];

    foreach ($environmentFiles as $environmentFile) {
        $contents = file_get_contents($projectRoot.DIRECTORY_SEPARATOR.$environmentFile);

        expect($contents)
            ->toContain('DB_CONNECTION=mysql')
            ->toContain('DB_HOST=127.0.0.1')
            ->toContain('DB_PORT=3306')
            ->toContain('DB_DATABASE=byokai')
            ->toContain('DB_USERNAME=root');
    }

    expect(file_get_contents($projectRoot.DIRECTORY_SEPARATOR.'config'.DIRECTORY_SEPARATOR.'database.php'))
        ->toContain("'default' => env('DB_CONNECTION', 'mysql')");

    $queueConfig = file_get_contents($projectRoot.DIRECTORY_SEPARATOR.'config'.DIRECTORY_SEPARATOR.'queue.php');

    expect(substr_count($queueConfig, "env('DB_CONNECTION', 'mysql')"))->toBe(2);

    $composerScripts = json_decode(file_get_contents($projectRoot.DIRECTORY_SEPARATOR.'composer.json'), true, flags: JSON_THROW_ON_ERROR)['scripts']['post-create-project-cmd'];

    expect($composerScripts)->each->not->toContain('database/database.sqlite');
});
