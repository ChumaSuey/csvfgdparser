from typing import List, Tuple
import re

def parse_fgd(file_path: str) -> Tuple[List[str], List[str], List[str]]:
    """
    Parses the FGD file and returns three lists: solid, point, base.
    Handles multi-line entity definitions and most FGD formats.
    """
    solid = []
    point = []
    base = []

    # Regex patterns
    entity_re = re.compile(
        r'^@(\w+Class).*?=\s*([^\s:]+)\s*:\s*"([^"]+)"', re.IGNORECASE
    )
    # Improved baseclass regex: matches with or without base(...) and with or without description
    base_re = re.compile(
        r'^@(?:BaseClass|baseclass)(?:\s+base\([^)]+\))*\s*=\s*([^\s:]+)(?:\s*:\s*"([^"]*)")?',
        re.IGNORECASE
    )

    with open(file_path, 'r', encoding='utf-8') as file:
        block = []
        for line in file:
            line = line.strip()
            if not line or line.startswith('//'):
                continue
            if line.startswith('@') and block:
                # Process previous block
                block_text = ' '.join(block)
                match = entity_re.match(block_text)
                if match:
                    entity_type, entity_name, description = match.groups()
                    entry = f"{entity_name} : {description}"
                    if entity_type.lower() in [
                        "solidclass", "targetclass", "ammoclass", "weaponclass", "monsterclass"
                    ]:
                        solid.append(entry)
                    elif entity_type.lower() == "pointclass":
                        point.append(entry)
                else:
                    base_match = base_re.match(block_text)
                    if base_match:
                        entity_name, description = base_match.groups()
                        entry = f"{entity_name or 'UnnamedBase'} : {description or ''}"
                        base.append(entry)
                block = []
            block.append(line)
        # Process last block
        if block:
            block_text = ' '.join(block)
            match = entity_re.match(block_text)
            if match:
                entity_type, entity_name, description = match.groups()
                entry = f"{entity_name} : {description}"
                if entity_type.lower() in [
                    "solidclass", "targetclass", "ammoclass", "weaponclass", "monsterclass"
                ]:
                    solid.append(entry)
                elif entity_type.lower() == "pointclass":
                    point.append(entry)
            else:
                base_match = base_re.match(block_text)
                if base_match:
                    entity_name, description = base_match.groups()
                    entry = f"{entity_name or 'UnnamedBase'} : {description or ''}"
                    base.append(entry)

    return solid, point, base