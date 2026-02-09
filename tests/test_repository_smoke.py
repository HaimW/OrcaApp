from pathlib import Path
import json


def test_package_json_exists_and_has_build_script():
    package_json = Path('package.json')
    assert package_json.exists(), 'package.json should exist at repo root'

    data = json.loads(package_json.read_text(encoding='utf-8'))
    assert 'scripts' in data, 'package.json must include scripts'
    assert 'build' in data['scripts'], 'package.json scripts must include build'
